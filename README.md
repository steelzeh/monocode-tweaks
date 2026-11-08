# Monocode tweaks

Small add-ons for [MonoCode](https://github.com/hardbeat920/monocode). Each folder is one tweak.

## Regenerate title

Right-click a chat and choose **Regenerate title**. A new title is written from the whole conversation.

It asks for these permissions:

- **Read chat messages:** it reads the chat you right-clicked.
- **Use your model and tokens:** it sends part of that chat to your background model.
- **Rename chats:** it renames only the chat you right-clicked.

## Worktrees

Adds a **Worktrees** tab to the right panel. It lists the project's working copies, and a click switches to one.

It asks for this permission:

- **See and switch worktrees:** it reads the project's worktrees and switches between them.

## Install

**Tweaks are not in the official MonoCode app yet.** You need a build that has the Tweaks feature.

1. Open **Settings**, then **Tweaks**.
2. Press **Add from GitHub** and paste `steelzeh/monocode-tweaks/regenerate-title` or `steelzeh/monocode-tweaks/worktrees`.
3. Check what it does, press **Install**, and turn it on.

## Safety

A tweak runs in a sandbox with no access to your files, the network or a shell. It can only use the permissions you see before you turn it on. If its files change, it turns off until you accept the new version.

Read the code before you install a tweak. Everything it does is in its folder.

## License

MIT. The title prompt in `regenerate-title/main.js` comes from MonoCode, which is also MIT. See [LICENSE](LICENSE).
