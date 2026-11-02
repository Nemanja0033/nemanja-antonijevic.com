# Changelog

Every released version, newest first. `./dev.sh version` adds a new entry from the
commit messages since the previous one; review and edit it before committing.

## v0.2.0 – 2026-11-02

- Add project skills for checking and re-toning posts
- Extract UI primitives into src/components/ui
- Add the AI-driven development post and broaden the headline
- Document every component with TSDoc
- Move the contact bubbles next to the Blog button
- Shorten the Serbian headline and open the e-mail bubble in a new tab
- Accessibility pass: skip link, new-tab notices, target sizes, names
- Add a minimal "Latest posts" section to the home page
- Add FloatingBubble, give each UI component its own folder
- Extract PostCard and make UI base styles order-independent
- Show 5 posts per page
- Consistent type scale for page titles

## v0.1.0 – 2026-10-29

- Initial setup of the project
- Make the MDX blog production ready
- Move posts into folders with covers, add JSON-LD, fix MDX styles
- Use plain static generation instead of Cache Components
- Add tags and static pagination to the blog
- Apply the zine blog design
- Make the site bilingual (sr + en)
- Use a photo avatar in the home blob with a blue duotone
- Animate the avatar blob and update the home headline
- Let the home dots wander and tweak the Serbian headline
- Add LinkedIn and e-mail bubbles under the home photo
- Simplify the footer to a credit line
- Add dev.sh with an interactive "new post" command
- Show the version in the footer; add `./dev.sh version` and this changelog
