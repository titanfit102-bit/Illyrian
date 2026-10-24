// A separate, PR-only cross-engine smoke suite. Does not replace Chromium QA
// and does not certify Safari/iOS hardware, touch gestures or VoiceOver.
const {defineConfig}=require('@playwright/test');
const base=require('./playwright.config.cjs');
module.exports=defineConfig({
 ...base,
 testMatch:['**/illyrian-v17-focus.spec.cjs','**/illyrian-v17-mobile-touch.spec.cjs'],
 grep:/(Built-in Reels actual keyboard trap|Built-in Stories keyboard focus|Reels Feed opener focus distinguishes|Reel-to-profile and chat restores internal focus|Mobile touch emulation)/,
 use:{...base.use,browserName:'webkit'},
 outputDir:'qa-results/artifacts-webkit',
 reporter:[['list'],['html',{open:'never',outputFolder:'qa-results/report-webkit'}]]
});
