import { Flex, Tag } from "antd"

export function CoveredSkills({ skills }: { skills: string[] }) {
  return (
    <Flex wrap="wrap" gap={8}>
      {skills.map((skill) => (
        <Tag
          key={skill}
          color="success"
          style={{ margin: 0, padding: "4px 10px", borderRadius: 6 }}
        >
          {skill}
        </Tag>
      ))}
    </Flex>
  );
}

export function MissingSkills({ skills }: { skills: string[][] }) {
  return (
    <Flex wrap="wrap" gap={8}>
      {skills.map((group, index) => (
        <Tag
          key={index}
          color="error"
          style={{ margin: 0, padding: "4px 10px", borderRadius: 6 }}
        >
          {group.join(" OR ")}
        </Tag>
      ))}
    </Flex>
  );
}