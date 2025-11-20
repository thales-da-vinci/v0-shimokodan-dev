// Data store for Shimokodan agents with unique IDs and abilities

export interface AgentAbility {
  id: string
  name: string
  description: string
  type: "passive" | "active"
  cooldown?: number
  energyCost?: number
}

export interface AgentTask {
  id: string
  name: string
  description: string
  function: string
  parameters: { name: string; type: string; required: boolean }[]
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
}

export interface Agent {
  id: string
  tokenId: string // NFT-like unique identifier
  name: string
  role: string
  level: number
  xp: number
  maxXp: number
  status: "active" | "idle" | "busy"
  avatarColor: string
  skills: {
    name: string
    level: number
    maxLevel: number
  }[]
  stats: {
    tasksCompleted: number
    successRate: number
    avgResponseTime: string
    totalRuntime: string
  }
  abilities: AgentAbility[]
  tasks: AgentTask[]
  metadata: {
    created: string
    lastActive: string
    owner: string
  }
}

export const agentsDatabase: Agent[] = [
  {
    id: "agent-001",
    tokenId: "SHIMO-NFT-00001",
    name: "Shimokodan Dev",
    role: "Full Stack Engineer",
    level: 12,
    xp: 750,
    maxXp: 1000,
    status: "active",
    avatarColor: "from-emerald-500 to-teal-500",
    skills: [
      { name: "Next.js Development", level: 8, maxLevel: 10 },
      { name: "API Design", level: 6, maxLevel: 10 },
      { name: "Database Management", level: 7, maxLevel: 10 },
      { name: "UI/UX Implementation", level: 9, maxLevel: 10 },
    ],
    stats: {
      tasksCompleted: 342,
      successRate: 94,
      avgResponseTime: "1.2s",
      totalRuntime: "156h",
    },
    abilities: [
      {
        id: "dev-001",
        name: "Code Generation",
        description: "Generate production-ready code in multiple languages",
        type: "active",
        cooldown: 5,
        energyCost: 20,
      },
      {
        id: "dev-002",
        name: "Bug Detection",
        description: "Automatically scan and identify bugs in codebase",
        type: "passive",
      },
      {
        id: "dev-003",
        name: "Auto-Deploy",
        description: "Deploy applications directly to production",
        type: "active",
        cooldown: 30,
        energyCost: 50,
      },
    ],
    tasks: [
      {
        id: "task-dev-001",
        name: "Build API Endpoint",
        description: "Create a new RESTful API endpoint with authentication",
        function: "createAPIEndpoint",
        parameters: [
          { name: "endpoint", type: "string", required: true },
          { name: "method", type: "GET|POST|PUT|DELETE", required: true },
          { name: "auth", type: "boolean", required: false },
        ],
        estimatedTime: "2-5 minutes",
        difficulty: "medium",
      },
      {
        id: "task-dev-002",
        name: "Deploy Application",
        description: "Deploy the current application to production environment",
        function: "deployApp",
        parameters: [
          { name: "environment", type: "staging|production", required: true },
          { name: "runTests", type: "boolean", required: false },
        ],
        estimatedTime: "5-10 minutes",
        difficulty: "hard",
      },
      {
        id: "task-dev-003",
        name: "Generate Component",
        description: "Create a new React component with specified props",
        function: "generateComponent",
        parameters: [
          { name: "componentName", type: "string", required: true },
          { name: "props", type: "object", required: false },
        ],
        estimatedTime: "1-3 minutes",
        difficulty: "easy",
      },
    ],
    metadata: {
      created: "2024-01-15",
      lastActive: "2 minutes ago",
      owner: "user_001",
    },
  },
  {
    id: "agent-002",
    tokenId: "SHIMO-NFT-00002",
    name: "Shimokodan Sales",
    role: "Outbound Specialist",
    level: 5,
    xp: 320,
    maxXp: 500,
    status: "active",
    avatarColor: "from-blue-500 to-cyan-500",
    skills: [
      { name: "Lead Generation", level: 7, maxLevel: 10 },
      { name: "Email Outreach", level: 8, maxLevel: 10 },
      { name: "Follow-up Automation", level: 6, maxLevel: 10 },
      { name: "CRM Management", level: 5, maxLevel: 10 },
    ],
    stats: {
      tasksCompleted: 156,
      successRate: 87,
      avgResponseTime: "0.8s",
      totalRuntime: "89h",
    },
    abilities: [
      {
        id: "sales-001",
        name: "Lead Finder",
        description: "Automatically discover and qualify potential leads",
        type: "active",
        cooldown: 10,
        energyCost: 15,
      },
      {
        id: "sales-002",
        name: "Email Sequence",
        description: "Create and execute multi-step email campaigns",
        type: "active",
        cooldown: 20,
        energyCost: 25,
      },
    ],
    tasks: [
      {
        id: "task-sales-001",
        name: "Find Leads",
        description: "Search for potential customers matching criteria",
        function: "findLeads",
        parameters: [
          { name: "industry", type: "string", required: true },
          { name: "location", type: "string", required: false },
          { name: "companySize", type: "string", required: false },
        ],
        estimatedTime: "10-15 minutes",
        difficulty: "medium",
      },
      {
        id: "task-sales-002",
        name: "Send Email Campaign",
        description: "Launch a personalized email outreach campaign",
        function: "sendEmailCampaign",
        parameters: [
          { name: "recipients", type: "array", required: true },
          { name: "template", type: "string", required: true },
        ],
        estimatedTime: "3-5 minutes",
        difficulty: "easy",
      },
    ],
    metadata: {
      created: "2024-02-20",
      lastActive: "15 minutes ago",
      owner: "user_001",
    },
  },
  {
    id: "agent-003",
    tokenId: "SHIMO-NFT-00003",
    name: "Shimokodan Support",
    role: "Customer Success",
    level: 8,
    xp: 600,
    maxXp: 800,
    status: "idle",
    avatarColor: "from-purple-500 to-pink-500",
    skills: [
      { name: "Ticket Resolution", level: 9, maxLevel: 10 },
      { name: "Customer Communication", level: 8, maxLevel: 10 },
      { name: "Knowledge Base", level: 7, maxLevel: 10 },
      { name: "Sentiment Analysis", level: 6, maxLevel: 10 },
    ],
    stats: {
      tasksCompleted: 234,
      successRate: 96,
      avgResponseTime: "0.5s",
      totalRuntime: "124h",
    },
    abilities: [
      {
        id: "support-001",
        name: "Auto-Reply",
        description: "Instantly respond to common customer inquiries",
        type: "passive",
      },
      {
        id: "support-002",
        name: "Ticket Triage",
        description: "Automatically categorize and prioritize support tickets",
        type: "active",
        cooldown: 5,
        energyCost: 10,
      },
    ],
    tasks: [
      {
        id: "task-support-001",
        name: "Resolve Ticket",
        description: "Analyze and resolve customer support ticket",
        function: "resolveTicket",
        parameters: [
          { name: "ticketId", type: "string", required: true },
          { name: "priority", type: "low|medium|high", required: false },
        ],
        estimatedTime: "5-8 minutes",
        difficulty: "medium",
      },
      {
        id: "task-support-002",
        name: "Generate KB Article",
        description: "Create knowledge base article from ticket resolution",
        function: "generateKBArticle",
        parameters: [
          { name: "topic", type: "string", required: true },
          { name: "difficulty", type: "beginner|intermediate|advanced", required: false },
        ],
        estimatedTime: "8-12 minutes",
        difficulty: "hard",
      },
    ],
    metadata: {
      created: "2024-03-01",
      lastActive: "2 hours ago",
      owner: "user_001",
    },
  },
]

export function getAgentById(id: string): Agent | undefined {
  return agentsDatabase.find((agent) => agent.id === id)
}

export function getAllAgents(): Agent[] {
  return agentsDatabase
}
