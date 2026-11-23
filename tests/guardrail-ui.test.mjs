import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanState,agentById} from '../src/domain.js';
import {renderModal} from '../src/views.js';
import {renderOpsModal} from '../src/operations.js';

test('New agent setup treats existing guardrails as unknown and extra protection as optional',()=>{
 const state=cleanState();
 const html=renderModal(state,{modal:{kind:'add-agent'}});
 assert.match(html,/Existing guardrails: Not assessed/);
 assert.match(html,/does not inspect provider settings/);
 assert.match(html,/name="guardrailRecommendation"/);
 assert.match(html,/value="none"[^>]*>No additional protection proposed/);
 assert.match(html,/value="offer"[^>]*>Offer protection for review/);
});

test('Agent settings retain optional mock recommendation without implying detection or enforcement',()=>{
 const state=cleanState();
 const agent=agentById(state,'atlas');
 agent.guardrailRecommendation='offer';
 const html=renderOpsModal(state,{modal:{kind:'op-agent-settings',id:'atlas'}});
 assert.match(html,/Existing guardrails: Not assessed/);
 assert.match(html,/does not discover or activate guardrails/);
 assert.match(html,/name="guardrailRecommendation"/);
 assert.match(html,/value="offer" selected/);
 assert.match(html,/Proposed guardrail handling \(demo\)/);
});
