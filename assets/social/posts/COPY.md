# Placeholder copy in the post templates

Every string in `social/posts/` is placeholder editorial copy. It exists so the
templates render against real text and so the type sizes are tuned against real
line lengths. Replace it before publishing.

| Template | Placeholder |
| --- | --- |
| Headline | "Why your nervous system needs 90 minutes to power down" |
| Kicker | "The wind-down window is not a luxury…" |
| Quote | "Rest is not what you earn after the work. It is part of the work." |
| List | "Three ways to fall asleep faster tonight" + three items |
| Stat | "1 in 3 adults sleep fewer than seven hours on a typical night" |
| CTA | "Save this. Then go to bed." |

**The stat card carries a deliberate warning in its source line.** The "1 in 3"
figure is broadly reported by the CDC, but do not publish it — or any statistic
— from this template without checking the current primary source and citing it
precisely. On a site that claims authority, an unverified number is the most
expensive kind of mistake.

To regenerate the templates with your own copy, edit the constants at the
bottom of `build/build_posts.py` and run `python3 build/build_all.py`.
