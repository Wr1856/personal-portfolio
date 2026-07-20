-- Initial real content, sourced from Wesley Maia's résumé and this project.
-- No fictional projects, certifications, prices, or metrics are created here.
-- Certifications are registered through the admin panel with the real files.

-- Professional profile ---------------------------------------------------------

insert into public.site_profile (
  name,
  professional_title_pt,
  professional_title_en,
  bio_pt,
  bio_en,
  email,
  whatsapp,
  github_url
) values (
  'Wesley Maia',
  'Desenvolvedor e Especialista em Soluções Digitais',
  'Developer and Digital Solutions Specialist',
  'Wesley Maia é bacharel em Ciência da Computação, com experiência em desenvolvimento, análise de sistemas, redes, infraestrutura, suporte, qualidade de software e ensino de tecnologia. Possui atuação em aplicações front-end e back-end, APIs, bancos de dados, ambientes Linux e Windows, ERP, infraestrutura, redes e armazenamento. Está expandindo sua atuação em marketing digital, criação visual, presença de marca, tráfego pago, conteúdo e engajamento.',
  'Wesley Maia holds a bachelor''s degree in Computer Science, with experience in software development, systems analysis, networking, infrastructure, technical support, software quality, and technology teaching. He works across front-end and back-end applications, APIs, databases, Linux and Windows environments, ERP, infrastructure, networking, and storage. He is expanding his practice into digital marketing, visual creation, brand presence, paid traffic, content, and engagement.',
  'W.maia.1856@gmail.com',
  '+5571991797751',
  'https://github.com/Wr1856'
);

-- Experiences -------------------------------------------------------------------
-- Dates use January 1st / December 31st as year-level boundaries, matching the
-- year ranges provided in the résumé.

insert into public.experiences (
  company, role_pt, role_en, description_pt, description_en,
  start_date, end_date, is_current, skills, is_published, sort_order
) values
(
  'Microlins',
  'Professor de Tecnologia da Informação',
  'Information Technology Instructor',
  'Ensino de tecnologia da informação, acompanhando turmas em informática, sistemas e fundamentos de computação.',
  'Information technology teaching, guiding classes in computing, systems, and computer science fundamentals.',
  '2022-01-01', '2022-12-31', false,
  array['Ensino', 'Informática', 'Windows'],
  true, 4
),
(
  'Planet Internet',
  'Projetista de Redes',
  'Network Designer',
  'Projeto e documentação de redes para provedor de internet, incluindo planejamento de topologia e infraestrutura.',
  'Network design and documentation for an internet service provider, including topology planning and infrastructure.',
  '2023-01-01', '2024-12-31', false,
  array['Redes', 'Infraestrutura', 'Documentação'],
  true, 3
),
(
  'Rede Sarah de Hospitais',
  'Analista de Sistemas',
  'Systems Analyst',
  'Análise de sistemas em ambiente hospitalar, com atuação em sistemas corporativos, ERP, infraestrutura, redes e armazenamento (NetApp), em ambientes Linux e Windows.',
  'Systems analysis in a hospital environment, working with corporate systems, ERP, infrastructure, networking, and storage (NetApp) across Linux and Windows environments.',
  '2024-01-01', '2026-01-01', false,
  array['Análise de sistemas', 'ERP', 'Linux', 'Windows Server', 'NetApp', 'Redes'],
  true, 2
),
(
  'ArcelorMittal',
  'Analista de Testes de Qualidade',
  'Quality Assurance Analyst',
  'Testes e qualidade de software em ambiente industrial, com planejamento e execução de testes e apoio a processos ágeis (Scrum e Kanban).',
  'Software testing and quality assurance in an industrial environment, planning and executing tests and supporting agile processes (Scrum and Kanban).',
  '2026-01-01', null, true,
  array['QA', 'Testes', 'Scrum', 'Kanban'],
  true, 1
);

-- Services ------------------------------------------------------------------------
-- No fictional prices: starting_price stays null ("investment defined after
-- scope analysis") until real pricing is registered through the panel.

insert into public.services (
  slug, title_pt, title_en, description_pt, description_en,
  category, scope_pt, scope_en,
  remote_available, onsite_available, featured, is_published, sort_order
) values
(
  'sites-e-sistemas',
  'Sites e sistemas sob medida',
  'Custom websites and systems',
  'Desenvolvimento de sites, sistemas web e aplicações completas, do planejamento à publicação.',
  'Development of websites, web systems, and complete applications, from planning to launch.',
  'build_site',
  'Levantamento de requisitos, front-end, back-end, banco de dados, publicação e orientação de uso.',
  'Requirements gathering, front-end, back-end, database, deployment, and usage guidance.',
  true, false, true, true, 1
),
(
  'apis-e-integracoes',
  'APIs, automações e integrações',
  'APIs, automations, and integrations',
  'Construção de APIs e integrações entre sistemas, além de automações que reduzem trabalho manual.',
  'Building APIs and integrations between systems, plus automations that reduce manual work.',
  'build_site',
  'Modelagem, desenvolvimento, documentação e testes de APIs e rotinas de integração.',
  'Modeling, development, documentation, and testing of APIs and integration routines.',
  true, false, false, true, 2
),
(
  'diagnostico-tecnico',
  'Diagnóstico e resolução de problemas técnicos',
  'Technical diagnosis and troubleshooting',
  'Investigação e correção de problemas em sistemas, computadores, redes e servidores.',
  'Investigation and resolution of issues in systems, computers, networks, and servers.',
  'fix_problem',
  'Diagnóstico, plano de correção, execução e verificação, com registro do que foi feito.',
  'Diagnosis, remediation plan, execution, and verification, with a record of what was done.',
  true, true, true, true, 3
),
(
  'infraestrutura-e-redes',
  'Infraestrutura, redes e suporte',
  'Infrastructure, networking, and support',
  'Planejamento e manutenção de infraestrutura, redes, servidores e rotinas de suporte.',
  'Planning and maintenance of infrastructure, networks, servers, and support routines.',
  'fix_problem',
  'Avaliação do ambiente, proposta de melhoria, implantação e acompanhamento.',
  'Environment assessment, improvement proposal, implementation, and follow-up.',
  true, true, false, true, 4
),
(
  'marketing-digital',
  'Marketing digital e divulgação',
  'Digital marketing and promotion',
  'Área em expansão: divulgação de negócios com conteúdo, campanhas e tráfego pago, aplicada com transparência sobre maturidade e resultados.',
  'Expanding practice: business promotion with content, campaigns, and paid traffic, applied with transparency about maturity and results.',
  'promote_business',
  'Planejamento de presença digital, produção de conteúdo, configuração de campanhas e acompanhamento.',
  'Digital presence planning, content production, campaign setup, and monitoring.',
  true, false, false, true, 5
),
(
  'identidade-digital',
  'Identidade digital e presença de marca',
  'Digital identity and brand presence',
  'Organização da presença digital: landing pages, perfis, materiais visuais e comunicação consistente.',
  'Organizing digital presence: landing pages, profiles, visual materials, and consistent communication.',
  'improve_identity',
  'Diagnóstico da presença atual, definição visual, construção de páginas e materiais de apoio.',
  'Current presence diagnosis, visual definition, page building, and supporting materials.',
  true, false, false, true, 6
);

-- Projects --------------------------------------------------------------------------
-- One real, verifiable project: this portfolio itself, built under the
-- Wesley Maia brand. Further projects are registered through the admin panel.

insert into public.projects (
  slug, title_pt, title_en, summary_pt, summary_en,
  problem_pt, problem_en, solution_pt, solution_en,
  result_pt, result_en,
  category, project_type, status, technologies,
  repository_url, featured, is_published, sort_order
) values (
  'portfolio-wesley-maia',
  'Portfólio Wesley Maia',
  'Wesley Maia Portfolio',
  'Portfólio bilíngue e administrável, com acervo de projetos, certificações e experiências gerenciado pelo Supabase.',
  'Bilingual, manageable portfolio with an archive of projects, certifications, and experience managed through Supabase.',
  'Apresentar a marca Wesley Maia de forma profissional exigia um site bilíngue, seguro e atualizável sem alteração de código.',
  'Presenting the Wesley Maia brand professionally required a bilingual, secure website that could be updated without code changes.',
  'Aplicação Next.js com App Router, conteúdo servido pelo Supabase com Row Level Security, painel administrativo autenticado, PWA e internacionalização completa.',
  'Next.js application with the App Router, content served by Supabase with Row Level Security, an authenticated admin panel, PWA support, and full internationalization.',
  'Site publicado em português e inglês, com painel próprio para gerenciar o acervo e base preparada para uma assistente de IA.',
  'Site published in Portuguese and English, with its own panel to manage the archive and a foundation prepared for an AI assistant.',
  'web',
  'brand',
  'maintained',
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
  'https://github.com/Wr1856',
  true, true, 1
);
