"""Reuse proven browser execution only for a bounded documentation-only PR delta."""
import json, os, re, subprocess, urllib.request
from pathlib import Path

REPO = 'titanfit102-bit/Illyrian'
WORKFLOW = 'illyrian-v17-browser-qa.yml'
STEPS = {'browser-smoke-pull_request': 'Run ILLYRIAN module, QA Lab, keyboard, and visual evidence tests',
         'webkit-smoke-pull_request': 'Run bounded WebKit Reels and Stories keyboard smoke'}

def docs_only(paths):
    return bool(paths) and all(p.endswith('.md') and (p in {'README.md','CURRENT_STATE.md','MASTER_HANDOFF.md'} or p.startswith(('docs/','architecture/')) or p == 'demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md') and not p.startswith(('docs/security/','docs/F06')) for p in paths)

def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()

def delta(before, head):
    if not all(re.fullmatch(r'[0-9a-f]{40}', x or '') for x in [before, head]):
        return []
    subprocess.run(['git','merge-base','--is-ancestor',before,head], check=True, capture_output=True)
    return [p for p in git('diff','--name-only','--no-renames',before,head).splitlines() if p]

def api(path):
    request = urllib.request.Request('https://api.github.com/repos/'+REPO+'/'+path,
        headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'], 'Accept':'application/vnd.github+json'})
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.load(response)

def proven_jobs(jobs):
    return all(any(j.get('name') == name and j.get('conclusion') == 'success' and
        any(s.get('name') == step and s.get('conclusion') == 'success' for s in j.get('steps', []))
        for j in jobs) for name,step in STEPS.items())

def decide(event, event_name, get=api, changes=delta):
    pr=event.get('pull_request', {})
    head=pr.get('head',{}).get('sha',''); base=pr.get('base',{}).get('sha','')
    if event_name != 'pull_request' or event.get('action') != 'synchronize' or pr.get('head',{}).get('repo',{}).get('full_name') != REPO:
        return False, 'full: non-synchronize event or fork'
    if not docs_only(changes(event.get('before',''), head)):
        return False, 'full: runtime/config/security/unknown delta'
    runs=get('actions/workflows/'+WORKFLOW+'/runs?event=pull_request&status=success&per_page=20')['workflow_runs']
    for run in runs:
        if str(run['id']) == os.environ.get('GITHUB_RUN_ID'): continue
        if run.get('head_repository',{}).get('full_name') != REPO: continue
        if not any(p.get('number') == pr.get('number') and p.get('base',{}).get('sha') == base for p in run.get('pull_requests', [])): continue
        previous=run.get('head_sha','')
        if previous == head: continue
        try:
            if not docs_only(changes(previous, head)): continue
        except (subprocess.SubprocessError, ValueError): continue
        jobs=get('actions/runs/'+str(run['id'])+'/jobs?per_page=100')['jobs']
        if proven_jobs(jobs):
            return True, 'documentation only; unchanged runtime already executed: '+run['html_url']+' at '+previous
    return False, 'full: no compatible successful full Chromium+WebKit execution'

def main():
    try:
        light, reason=decide(json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text()), os.environ.get('GITHUB_EVENT_NAME',''))
    except Exception as error:
        light,reason=False,'full: classifier uncertainty ('+type(error).__name__+')'
    with open(os.environ['GITHUB_OUTPUT'],'a') as f: f.write('docs_only='+str(light).lower()+'\n')
    print(reason)
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as f: f.write('Browser scope: '+reason+'\n')
if __name__ == '__main__': main()
