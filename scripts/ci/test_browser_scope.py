import copy, unittest
from browser_scope import docs_only, decide, proven_jobs, STEPS, REPO

class ScopeTests(unittest.TestCase):
    def setUp(self):
        self.event={'action':'synchronize','before':'a'*40,'pull_request':{'number':1,'head':{'sha':'b'*40,'repo':{'full_name':REPO}},'base':{'sha':'c'*40}}}
        self.run={'id':123,'head_repository':{'full_name':REPO},'head_sha':'d'*40,'pull_requests':[{'number':1,'base':{'sha':'c'*40}}],'html_url':'https://github.com/'+REPO+'/actions/runs/123'}
        self.jobs=[{'name':k,'conclusion':'success','steps':[{'name':v,'conclusion':'success'}]} for k,v in STEPS.items()]
    def get(self,path): return {'jobs':self.jobs} if '/jobs?' in path else {'workflow_runs':[self.run]}
    def changes(self,a,b): return ['CURRENT_STATE.md']
    def test_docs(self): self.assertTrue(docs_only(['CURRENT_STATE.md','MASTER_HANDOFF.md','architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md']))
    def test_critical_paths(self):
        for p in ['AGENTS.md','docs/security/THREAT_MODEL.md','docs/F06_REQUIRED_CHECKS_DECISION.md','.github/workflows/qa.yml','qa/test.cjs','demo/app.js','security/package-lock.json','scripts/ci/browser_scope.py','unknown.md','playwright.config.cjs']:
            with self.subTest(path=p): self.assertFalse(docs_only([p]))
    def test_empty(self): self.assertFalse(docs_only([]))
    def test_verified_docs(self): self.assertTrue(decide(self.event,'pull_request',self.get,self.changes)[0])
    def test_functional_delta(self): self.assertFalse(decide(self.event,'pull_request',self.get,lambda a,b:['demo/app.js'])[0])
    def test_long_pr_unverified_earlier_code(self):
        self.assertFalse(decide(self.event,'pull_request',self.get,lambda a,b:['CURRENT_STATE.md'] if a=='a'*40 else ['demo/app.js'])[0])
    def test_changed_base(self):
        self.run['pull_requests'][0]['base']['sha']='e'*40
        self.assertFalse(decide(self.event,'pull_request',self.get,self.changes)[0])
    def test_skipped_not_evidence(self):
        self.jobs[1]['steps'][0]['conclusion']='skipped'
        self.assertFalse(decide(self.event,'pull_request',self.get,self.changes)[0])
    def test_no_green_run(self): self.assertFalse(decide(self.event,'pull_request',lambda p:{'workflow_runs':[]},self.changes)[0])
    def test_dispatch_push_opened_and_fork_full(self):
        for e in ['push','workflow_dispatch']: self.assertFalse(decide(self.event,e,self.get,self.changes)[0])
        self.event['action']='opened';self.assertFalse(decide(self.event,'pull_request',self.get,self.changes)[0])
        self.event['action']='synchronize';self.event['pull_request']['head']['repo']['full_name']='other/fork'
        self.assertFalse(decide(self.event,'pull_request',self.get,self.changes)[0])
    def test_api_failure_propagates_to_fail_closed_main(self):
        def fail(path): raise OSError('offline')
        with self.assertRaises(OSError): decide(self.event,'pull_request',fail,self.changes)
if __name__=='__main__': unittest.main()
