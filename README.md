# MatchProfile
React widget

# Description:
Widget has two categories:
- **Prioritized profiles** by default we made sorting by priority.
- **Paused profiles** in random order.

The user can sort items from both of these lists. 

I decided to manage state of the app in MatchProfile container`s state because in future this logic can be transferred 
to specific state container or library which will be responsible for whole application state.

For demonstration purpose data are stored in **mock.js** file, so in future it can be easily injected into state container. 

Because in description to the task were not specified the behavior of items in categories I decided to leave the 
last items in every list. I was guided by the idea that there should be at least one priority profile and the 
last profile in the pool already has the lowest priority.

## Instruction
1. Clone repository into your folder.
2. Install dependencies.
3. Run script `npm run dev`.
4. The result of test will be available on *http://localhost:8080*.

**In case you`d like to test on mobile device or tablets:**
I was using [browser-sync](https://browsersync.io/)
1. Install browser-sync `npm install -g browser-sync`
2. In *package.json* file find scrip named **mobile** and update there path to cloned project but live directory at the end.
3. Run `npm run mobile` and in the console you`ll see the exact address of page. For example *http://192.168.0.193:7789*
