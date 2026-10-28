/**
 * One-off: copy the page content that used to be hardcoded as component
 * fallbacks (Studio, Contact, Publications, Awards, Join Us) into the CMS, so
 * the CMS becomes the only source of page content.
 *
 * Content-preserving by construction:
 *   - missing singletons are created with createIfNotExists
 *   - every field is written with setIfMissing — anything already set (e.g.
 *     the founder portrait, the intro slideshow) is never touched
 *   - re-running is harmless; a second run reports nothing left to set
 *   - drafts: an EMPTY draft of a seeded page (system fields only) is
 *     discarded — it would hide the published content in /admin. A draft
 *     with content is never deleted; it only gets its missing fields filled.
 *
 * Dry run by default (prints what it would do, writes nothing). Runs with your
 * `sanity login` auth:
 *   npx sanity exec scripts/seed-page-content.ts --with-user-token -- --dataset development
 *   npx sanity exec scripts/seed-page-content.ts --with-user-token -- --dataset development --apply
 *
 * Deliberately NOT seeded: the placeholder phone (+961 1 234 567), the
 * LinkedIn URL (company/addmindhospitality — Audit N5) and the map link (not
 * shown on the site). The client fills those in /admin.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";

// ---- args ----

const args = process.argv.slice(2);
const datasetArg = args[args.indexOf("--dataset") + 1];
const APPLY = args.includes("--apply");

if (!args.includes("--dataset") || !datasetArg || datasetArg.startsWith("--")) {
  console.error("Refusing to run without an explicit --dataset <name>.");
  process.exit(1);
}

const client = getCliClient({ apiVersion: "2025-12-03" }).withConfig({
  dataset: datasetArg,
});

// ---- content ----

// A local file to upload as a Sanity asset (deduplicated by content hash).
type Upload = { upload: "image" | "file"; path: string };

type Field = {
  path: string;
  value: unknown | Upload;
  // Text written during the redesign build rather than taken from the
  // original site — flagged in the output for review before production.
  review?: boolean;
};

type Doc = { _id: string; _type: string; fields: Field[] };

const PUBLIC = join(process.cwd(), "public");

const DOCS: Doc[] = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    fields: [
      { path: "brandLine", value: "House of Design by Suzy Habre" },
      {
        path: "locations",
        value: [
          {
            _key: "beirut",
            _type: "object",
            label: "Beirut",
            address: "Achrafieh,\nBeirut, Lebanon",
          },
          {
            _key: "dubai",
            _type: "object",
            label: "Dubai",
            address: "Dubai Harbour,\nnext to Bebeach",
          },
        ],
      },
      { path: "email", value: "info@houseofdesign.lb" },
      {
        path: "socials",
        value: [
          {
            _key: "instagram",
            _type: "object",
            platform: "instagram",
            url: "https://www.instagram.com/hod.houseofdesign/",
          },
        ],
      },
    ],
  },
  {
    _id: "studioPage",
    _type: "studioPage",
    fields: [
      { path: "founder.name", value: "Suzy Habre" },
      { path: "founder.role", value: "Founder & CEO, House of Design" },
      {
        path: "founder.bio",
        value:
          "Suzy Habre travels the world with a caring heart and a sharp eye for detail — shaped by a life of contrasts, raised and educated among diverse cultures, yet forever marked by her time in Nepal, where she fell deeply in love with nature.\n\nA beacon of bespoke design, Suzy shares with her team a love of excellence and a deep understanding of others — qualities she believes are the foundation of their success.",
      },
      {
        path: "founder.linkLabel",
        value: "Read the interview with BUILD",
        review: true,
      },
      {
        path: "founder.linkUrl",
        value: "https://www.build-review.com/issues/q2-2020/22/",
      },
      {
        path: "intro.heading",
        value: "House of Design is an interior design studio rooted in Beirut",
        review: true,
      },
      {
        path: "intro.body",
        value:
          "We create spaces inspired by the emotions we’ve experienced, so you can step inside, live the moment, and leave with emotions of your own.\n\nOur designs bring beauty and practicality together, transforming every space into a reflection of the people who live in it — from first sketch to final detail.",
      },
      { path: "disciplines.heading", value: "What we do" },
      {
        path: "disciplines.body",
        value:
          "Experts in high-end F&B spaces, we apply our sophisticated interior design skills to restaurants, beaches, lounges, and other exclusive venues, tailoring our expertise to craft exceptional environments throughout the sector.",
      },
      {
        path: "disciplines.sectors",
        value: ["Private Residential", "Restaurants", "Lounges", "Beaches"],
      },
      {
        path: "disciplines.services",
        value: [
          "Architecture",
          "Interior Design",
          "Interior Architecture",
          "Creative Concept",
        ],
      },
    ],
  },
  {
    _id: "publicationsPage",
    _type: "publicationsPage",
    fields: [
      {
        path: "publications",
        review: true, // the three descriptions are build-time summaries
        value: [
          {
            _key: "build",
            _type: "object",
            image: { upload: "image", path: join(PUBLIC, "press.png") },
            publication: "BUILD Magazine",
            date: "Design & Build, Q2 2020",
            description:
              "House of Design is featured for its refined, emotion-led approach to hospitality interiors across the region.",
            url: "https://www.build-review.com/issues/q2-2020/22/",
          },
          {
            _key: "hospitality-news",
            _type: "object",
            image: { upload: "image", path: join(PUBLIC, "press-2.png") },
            publication: "Hospitality News",
            date: "Eye for Design",
            description:
              "A look at the studio's work shaping restaurants, beaches and lounges into distinctive, atmospheric venues.",
            url: "https://issuu.com/hospitalityservices/docs/hospitality_news_131_low_res",
          },
          {
            _key: "noun",
            _type: "object",
            image: { upload: "image", path: join(PUBLIC, "press-3.png") },
            publication: "Noun Magazine",
            date: "Énergie et créativité",
            description:
              "An interview on the studio's founder, her influences, and the philosophy behind House of Design.",
            url: "https://www.scribd.com/doc/175579206/Suzy-Nasr-Noun-Magazine",
          },
        ],
      },
    ],
  },
  {
    _id: "awardsPage",
    _type: "awardsPage",
    fields: [
      {
        path: "recognition",
        review: true,
        value: [
          ["mad-beirut", "Mad Beirut", ["Best New Club, Time Out Beirut Awards 2012"]],
          ["white-beirut", "White Beirut", ["Best Outdoor Venue, Time Out Beirut Awards 2012"]],
          [
            "iris-beirut",
            "Iris Beirut",
            [
              "Best Lounge Bar, Time Out Beirut Awards 2012",
              "Shortlisted for Best Bar/Club Lounge, Global Design 2019",
            ],
          ],
          ["iris-yas", "Iris Yas Island", ["Best Bar, What's On Awards 2015"]],
          [
            "white-dubai",
            "White Dubai",
            [
              "World's Finest Club",
              "Finest Club Award 2015",
              "Best Club, Time Out Dubai Awards 2015",
              "Best Nightclub, Ahlan! Awards 2015",
              "Ranked #49 in DJ Mag's Top 100 Clubs in the World",
            ],
          ],
          ["matto-beirut", "Matto Beirut", ["Shortlisted for Best Restaurant, Africa & MENA Design 2019"]],
          ["indie-dubai", "Indie Dubai", ["Shortlisted in the Top 10 for Best Bar, Ahlan! Awards"]],
        ].map(([_key, project, awards]) => ({
          _key,
          _type: "object",
          project,
          awards,
        })),
      },
      {
        path: "studioAwards",
        review: true,
        value: [
          "Lebanon Web Awards 2012",
          "Pan Arab Awards 2013",
          "Finest Clubs Award 2015",
          "Honorary award from the Lebanese Restaurant & Bar Syndicate for innovation in F&B design — 2015",
          "Finalist, Restaurant & Bar Design Award (2016 and 2017) and International Hotel & Property Awards (2019)",
          "Winner, International Design Award (SBID) — 2019",
          "Most Innovative Design Practice in Beirut, BUILD 2020 Design & Build Awards",
        ],
      },
    ],
  },
  {
    _id: "joinUsPage",
    _type: "joinUsPage",
    fields: [
      {
        path: "video",
        value: {
          upload: "file",
          path: join(PUBLIC, "join-us", "join-us-video.mp4"),
        },
      },
      {
        path: "heading",
        value: "Grow as a professional on our side",
        review: true,
      },
      {
        path: "body",
        value:
          "We are always on the lookout for new members that will enrich the dynamic of our team, bringing on board new qualities and perspectives to our work.",
      },
      // email intentionally unset: the page falls back to Site Settings.
    ],
  },
];

// ---- helpers ----

function isUpload(value: unknown): value is Upload {
  return (
    typeof value === "object" &&
    value !== null &&
    "upload" in value &&
    "path" in value
  );
}

function getPath(doc: Record<string, unknown> | null, path: string) {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[key]
          : undefined,
      doc,
    );
}

function isEmpty(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

// Uploads (or, in a dry run, only looks up) a local file. Sanity dedupes
// assets by content hash, so re-uploading an existing file returns it.
async function resolveUpload({ upload, path }: Upload) {
  const sha1 = createHash("sha1").update(readFileSync(path)).digest("hex");
  const type = upload === "image" ? "sanity.imageAsset" : "sanity.fileAsset";
  const existing = await client.fetch<string | null>(
    `*[_type == $type && sha1hash == $sha1][0]._id`,
    { type, sha1 },
  );

  if (!APPLY) {
    return {
      label: existing
        ? `reuse existing ${upload} ${existing}`
        : `upload ${upload} ${basename(path)}`,
      value: null,
    };
  }

  const assetId =
    existing ??
    (
      await client.assets.upload(upload, readFileSync(path), {
        filename: basename(path),
      })
    )._id;

  return {
    label: `${existing ? "reused" : "uploaded"} ${upload} ${assetId}`,
    value: { _type: upload, asset: { _type: "reference", _ref: assetId } },
  };
}

// Replaces any Upload placeholders (at any depth) with asset references.
async function materialise(
  value: unknown,
  notes: string[],
): Promise<unknown> {
  if (isUpload(value)) {
    const { label, value: ref } = await resolveUpload(value);
    notes.push(label);
    return ref;
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => materialise(item, notes)));
  }
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(
        async ([key, item]) => [key, await materialise(item, notes)] as const,
      ),
    );
    return Object.fromEntries(entries);
  }
  return value;
}

function preview(value: unknown) {
  if (Array.isArray(value)) return `[${value.length} item(s)]`;
  if (isUpload(value)) return `<${value.upload}: ${basename(value.path)}>`;
  const text = String(value).replace(/\n/g, "⏎");
  return text.length > 70 ? `"${text.slice(0, 67)}…"` : `"${text}"`;
}

// The seed values for every field of `doc` that's empty in `target`, keyed
// by path (uploads resolved). Logs each field as set or skipped.
async function missingFields(
  doc: Doc,
  target: Record<string, unknown> | null,
  indent: string,
) {
  const patch: Record<string, unknown> = {};

  for (const field of doc.fields) {
    const flag = field.review ? "  [review: written during build]" : "";

    if (!isEmpty(getPath(target, field.path))) {
      console.log(`${indent}skip  ${field.path} — already set${flag}`);
      continue;
    }

    const notes: string[] = [];
    patch[field.path] = await materialise(field.value, notes);
    console.log(`${indent}set   ${field.path} = ${preview(field.value)}${flag}`);
    for (const note of notes) console.log(`${indent}        ↳ ${note}`);
  }

  return patch;
}

// Nested paths (e.g. "founder.name") need their parent object to exist.
function parentObjects(patch: Record<string, unknown>) {
  return Object.fromEntries(
    Object.keys(patch)
      .filter((path) => path.includes("."))
      .map((path) => [path.split(".")[0], {}]),
  );
}

// ---- run ----

async function run() {
  console.log(
    `\n${APPLY ? "APPLYING" : "DRY RUN (nothing is written)"} — dataset "${datasetArg}"\n`,
  );

  let toSet = 0;

  for (const doc of DOCS) {
    const existing = await client.getDocument(doc._id);
    console.log(
      `${doc._id} ${existing ? "(exists — only missing fields are filled)" : "(missing — will be created)"}`,
    );

    const patch = await missingFields(doc, existing ?? null, "  ");
    toSet += Object.keys(patch).length;

    if (APPLY && Object.keys(patch).length > 0) {
      await client
        .transaction()
        .createIfNotExists({ _id: doc._id, _type: doc._type })
        .patch(doc._id, (p) =>
          p.setIfMissing(parentObjects(patch)).setIfMissing(patch),
        )
        .commit();
      console.log(`  ✓ committed`);
    }

    // A draft shadows the published document in the Studio — editors would
    // see the draft, not the seeded content (and publishing it would wipe
    // the seed). An EMPTY draft (system fields only) holds nothing, so it's
    // discarded. A draft WITH content is never deleted: it gets the same
    // fill-only-missing treatment, so its edits survive.
    const draftId = `drafts.${doc._id}`;
    const draft = await client.getDocument(draftId);
    if (draft) {
      const hasContent = Object.keys(draft).some((key) => !key.startsWith("_"));
      if (!hasContent) {
        console.log(
          `  draft ${draftId} is empty — ${APPLY ? "discarded" : "would be discarded"} (it hides the published page in /admin)`,
        );
        if (APPLY) await client.delete(draftId);
      } else {
        console.log(`  draft ${draftId} has content — filling only its missing fields:`);
        const draftPatch = await missingFields(doc, draft, "    ");
        if (APPLY && Object.keys(draftPatch).length > 0) {
          await client
            .patch(draftId)
            .setIfMissing(parentObjects(draftPatch))
            .setIfMissing(draftPatch)
            .commit();
          console.log(`    ✓ committed`);
        }
      }
    }

    console.log("");
  }

  console.log(
    toSet === 0
      ? "Nothing to set — every field already has content."
      : `${toSet} field(s) ${APPLY ? "written" : "would be written"}.`,
  );
  console.log(
    "Not seeded on purpose: siteSettings.phone, the LinkedIn social link, siteSettings.mapUrl.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
