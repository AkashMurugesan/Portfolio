/**
 * Known skill/technology terms with the spellings JDs commonly use.
 * Used both to find what a JD asks for and to report gaps. Portfolio techs
 * missing from this list are added automatically (see analyze.ts).
 */
export type Term = { name: string; aliases: string[] };

export const KNOWN_TERMS: Term[] = [
  // Languages
  { name: "JavaScript", aliases: ["javascript", "js", "es6", "ecmascript"] },
  { name: "TypeScript", aliases: ["typescript", "ts"] },
  { name: "Java", aliases: ["java"] },
  { name: "Python", aliases: ["python"] },
  { name: "Go", aliases: ["golang", "go lang"] },
  { name: "Rust", aliases: ["rust"] },
  { name: "C#", aliases: ["c#", ".net", "dotnet", "asp.net"] },
  { name: "SQL", aliases: ["sql"] },
  // Backend
  { name: "Node.js", aliases: ["node.js", "nodejs", "node js", "node"] },
  { name: "NestJS", aliases: ["nestjs", "nest.js", "nest js"] },
  { name: "Express.js", aliases: ["express.js", "expressjs", "express"] },
  {
    name: "Spring Boot",
    aliases: ["spring boot", "spring-boot", "springboot", "spring"],
  },
  {
    name: "REST APIs",
    aliases: ["rest api", "rest apis", "restful", "api development", "apis"],
  },
  { name: "GraphQL", aliases: ["graphql"] },
  { name: "Microservices", aliases: ["microservices", "microservice", "micro-services"] },
  // Frontend
  { name: "React.js", aliases: ["react.js", "reactjs", "react js", "react"] },
  { name: "Next.js", aliases: ["next.js", "nextjs", "next js"] },
  { name: "Angular", aliases: ["angular"] },
  { name: "Vue.js", aliases: ["vue", "vue.js", "vuejs"] },
  // Data
  { name: "MongoDB", aliases: ["mongodb", "mongo"] },
  { name: "PostgreSQL", aliases: ["postgresql", "postgres"] },
  { name: "MySQL", aliases: ["mysql"] },
  { name: "Oracle", aliases: ["oracle", "pl/sql"] },
  { name: "Redis", aliases: ["redis"] },
  { name: "Elasticsearch", aliases: ["elasticsearch", "elastic search"] },
  { name: "Apache Kafka", aliases: ["apache kafka", "kafka"] },
  { name: "RabbitMQ", aliases: ["rabbitmq"] },
  // Cloud & DevOps
  { name: "AWS", aliases: ["aws", "amazon web services"] },
  { name: "AWS EC2", aliases: ["ec2"] },
  { name: "AWS ECS", aliases: ["ecs"] },
  { name: "AWS S3", aliases: ["s3"] },
  { name: "AWS SES", aliases: ["ses"] },
  { name: "AWS SNS", aliases: ["sns"] },
  { name: "AWS Lambda", aliases: ["lambda", "serverless"] },
  { name: "Azure", aliases: ["azure"] },
  { name: "GCP", aliases: ["gcp", "google cloud"] },
  { name: "Docker", aliases: ["docker", "containers", "containerization"] },
  { name: "Kubernetes", aliases: ["kubernetes", "k8s", "eks", "aks", "gke"] },
  { name: "Terraform", aliases: ["terraform", "infrastructure as code", "iac"] },
  {
    name: "CI/CD",
    aliases: ["ci/cd", "ci cd", "continuous integration", "jenkins", "github actions"],
  },
  { name: "Linux", aliases: ["linux", "unix", "bash", "shell scripting"] },
  { name: "Firebase", aliases: ["firebase"] },
  { name: "Vercel", aliases: ["vercel"] },
  { name: "Git", aliases: ["git", "github", "gitlab", "bitbucket"] },
  // Practices
  {
    name: "Authentication & Authorization",
    aliases: ["authentication", "authorization", "oauth", "sso", "auth"],
  },
  { name: "JWT", aliases: ["jwt", "json web token"] },
  {
    name: "Role-Based Access Control",
    aliases: ["rbac", "role-based access", "role based access", "access control"],
  },
  {
    name: "Data Migration",
    aliases: ["data migration", "migration", "migrations", "etl"],
  },
  {
    name: "Data Processing",
    aliases: ["data processing", "data pipelines", "large datasets", "data-processing"],
  },
  {
    name: "Backend Testing",
    aliases: ["unit testing", "unit tests", "testing", "tdd", "jest"],
  },
  {
    name: "Production Support",
    aliases: [
      "production support",
      "production issues",
      "debugging",
      "troubleshooting",
      "on-call",
    ],
  },
  {
    name: "Performance Optimization",
    aliases: [
      "performance",
      "optimization",
      "optimize",
      "latency",
      "scalability",
      "scalable",
    ],
  },
  { name: "Agile/Scrum", aliases: ["agile", "scrum", "sprint", "sdlc"] },
  { name: "GIS", aliases: ["gis", "geospatial"] },
  {
    name: "Event Streaming",
    aliases: ["streaming", "event-driven", "event driven", "message queue", "messaging"],
  },
  { name: "Code Review", aliases: ["code review", "code reviews"] },
];
