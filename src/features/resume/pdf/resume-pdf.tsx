import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumeDocument } from "../engine/types";

// Single-column, text-only layout with standard fonts: parses cleanly in ATS.
const s = StyleSheet.create({
  page: {
    paddingVertical: 34,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.35,
    color: "#111111",
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 20, lineHeight: 1.2, marginBottom: 2 },
  headline: { fontSize: 10.5, color: "#333333", marginTop: 2 },
  contact: { fontSize: 9, color: "#444444", marginTop: 4 },
  section: { marginTop: 11 },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    borderBottomWidth: 0.75,
    borderBottomColor: "#999999",
    paddingBottom: 2,
    marginBottom: 5,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#555555" },
  italic: { fontFamily: "Helvetica-Oblique", color: "#444444" },
  bullet: { flexDirection: "row", marginTop: 1.5, paddingLeft: 4 },
  bulletDot: { width: 9 },
  bulletText: { flex: 1 },
  entry: { marginBottom: 6 },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((b) => (
        <View key={b} style={s.bullet} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.heading}>{title}</Text>
      {children}
    </View>
  );
}

export function ResumePdf({ doc }: { doc: ResumeDocument }) {
  return (
    <Document title={`${doc.name} — Resume`} author={doc.name} creator="Portfolio">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{doc.name}</Text>
        <Text style={s.headline}>{doc.headline}</Text>
        <Text style={s.contact}>{doc.contact.join("  |  ")}</Text>

        <Section title="Professional Summary">
          <Text>{doc.summary}</Text>
        </Section>

        <Section title="Technical Skills">
          {doc.skills.map((g) => (
            <Text key={g.category} style={{ marginBottom: 1.5 }}>
              <Text style={s.bold}>{g.category}: </Text>
              {g.items.map((i) => i.name).join(", ")}
            </Text>
          ))}
        </Section>

        <Section title="Professional Experience">
          {doc.experience.map((e) => (
            <View key={`${e.company}-${e.role}`} style={s.entry}>
              <View style={s.row}>
                <Text style={s.bold}>
                  {e.company} | {e.role}
                </Text>
                <Text style={s.muted}>{e.dates}</Text>
              </View>
              <Text style={s.italic}>{e.location}</Text>
              <Bullets items={e.bullets} />
            </View>
          ))}
        </Section>

        {doc.projects.length > 0 ? (
          <Section title="Selected Projects">
            {doc.projects.map((p) => (
              <View key={p.name} style={s.entry}>
                <Text>
                  <Text style={s.bold}>{p.name}</Text>
                  <Text style={s.italic}>
                    {"  "}
                    {p.tech.join(" | ")}
                  </Text>
                </Text>
                <Bullets items={p.bullets} />
              </View>
            ))}
          </Section>
        ) : null}

        {doc.achievements.length > 0 ? (
          <Section title="Awards & Recognition">
            <Bullets items={doc.achievements} />
          </Section>
        ) : null}

        {doc.certifications.length > 0 ? (
          <Section title="Certifications">
            <Bullets items={doc.certifications} />
          </Section>
        ) : null}

        <Section title="Education">
          {doc.education.map((e) => (
            <View key={e.title}>
              <Text style={s.bold}>{e.title}</Text>
              <Text style={s.muted}>{e.detail}</Text>
            </View>
          ))}
        </Section>
      </Page>
    </Document>
  );
}
