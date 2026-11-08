// A row for each working copy. The app redraws this when the project changes.
const name = (copy) => {
  const label = copy.branch || copy.path.split("/").pop();
  return copy.submodule ? `${copy.submodule}: ${label}` : label;
};

return () => {
  const { project, worktrees, all_worktrees } = tweak.context;
  return visual.column([
    visual.text(project, { size: "subtitle" }),
    visual.button("All working copies", () => tweak.selectWorktree(null), {
      disabled: all_worktrees,
    }),
    ...worktrees.map((copy) =>
      visual.button(copy.main ? `${name(copy)} (main)` : name(copy), () => tweak.selectWorktree(copy.path), {
        disabled: copy.current,
      }),
    ),
  ]);
};
