"""Bounded current-tree secret/pattern checks. Never prints matched secret values."""
import argparse, hashlib, json, re, subprocess, sys
from pathlib import Path
RULES = {
 'private-key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
 'github-token': re.compile(r'\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,})\b'),
 'aws-access-id': re.compile(r'\bAKIA[A-Z0-9]{16}\b'),
 'stripe-live': re.compile(r'\bsk_live_[A-Za-z0-9]{20,}\b'),
 'credential-assignment': re.compile(r"""(?i)(?:api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*["'][A-Za-z0-9/+_=.-]{24,}["']"""),
}
STATIC = {'dynamic-code':re.compile(r'\b(?:eval\s*\(|new\s+Function\s*\()'),
          'document-write':re.compile(r'\bdocument\.write(?:ln)?\s*\(')}
def findings(text, javascript=False):
 return [k for k,v in {**RULES,**(STATIC if javascript else {})}.items() if v.search(text)]
def selftest():
 samples=['-----BEGIN '+'PRIVATE KEY-----','gh'+'p_'+'a'*36,'AK'+'IA'+'A'*16,'sk_'+'live_'+'z'*24,'api_key="'+'a'*32+'"']
 assert all(findings(t) for t in samples)
 assert findings('ev'+'al("x")',True) and findings('document.'+'write("x")',True)
 assert not findings('const title="Hello";',True)
 print('PASS: 7 unsafe fixtures rejected; safe fixture accepted (values redacted)')
def main():
 a=argparse.ArgumentParser();a.add_argument('--self-test',action='store_true');args=a.parse_args()
 if args.self_test: selftest();return
 files=subprocess.check_output(['git','ls-files','-z']).decode().split('\0'); errors=[]; count=0
 for name in filter(None,files):
  p=Path(name)
  if not p.is_file():continue
  try:text=p.read_text()
  except UnicodeError:continue
  count+=1
  for rule in findings(text, name.endswith(('.js','.html')) and '/vendor/' not in name): errors.append({'path':name,'rule':rule})
 for name,expected in json.loads(Path('security/vendor-integrity.json').read_text()).items():
  if hashlib.sha256(Path(name).read_bytes()).hexdigest()!=expected:errors.append({'path':name,'rule':'vendor-integrity'})
 for name in ['illyrian-i18n.js','locales/en.js','locales/sq.js','locales/it.js']:
  if Path('i18n',name).read_bytes()!=Path('demo/i18n',name).read_bytes():errors.append({'path':name,'rule':'locale-mirror'})
 print(json.dumps({'scope':'tracked current tree; bounded patterns, not comprehensive SAST/history scan','files':count,'findings':errors}))
 sys.exit(bool(errors))
if __name__=='__main__': main()
