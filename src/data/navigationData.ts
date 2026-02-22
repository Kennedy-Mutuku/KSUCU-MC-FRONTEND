export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const organizationSections: NavSection[] = [
  {
    title: 'Quick Access',
    items: [
      { label: 'Dashboard', href: '/home' },
      {
        label: 'Media Desk',
        children: [
          { label: 'News', href: '/news' },
          { label: 'Gallery', href: '/media' },
          {
            label: 'Socials',
            children: [
              { label: 'TikTok', href: 'https://tiktok.com/@ksucu_mc', external: true },
              { label: 'YouTube', href: 'https://www.youtube.com/@ksucu-mc', external: true },
              { label: 'Facebook', href: 'https://www.facebook.com/ksucumaincampus', external: true },
              { label: 'Instagram', href: 'https://www.instagram.com/ksucu_mc', external: true },
              { label: 'X (Twitter)', href: 'https://twitter.com/ksucumc', external: true },
            ],
          },
        ],
      },
      {
        label: 'Feedback',
        children: [
          { label: 'Submit Anonymously', href: '/recomendations' },
          { label: 'Submit with Identity', href: '/recomendations' },
        ],
      },
      { label: 'Financials', href: '/financial' },
      {
        label: 'Compassion',
        children: [
          { label: 'Request Support', href: '/compassion-counseling' },
          { label: 'Support the Ministry', href: '/compassion-counseling' },
        ],
      },
      { label: 'Requisitions', href: '/requisitions' },
      {
        label: 'Bible Study',
        children: [
          { label: 'Register for Bible Study', href: '/Bs' },
          { label: 'View Current BS Groups', href: '/Bs' },
        ],
      },
      { label: 'File Manager', href: '/my-docs' },
      { label: 'Library', href: '/library' },
      { label: 'Win a Soul', href: '/save' },
      {
        label: 'Governing Docs',
        children: [
          { label: 'Constitution', href: '/pdfs/constitution.pdf', external: true },
          { label: 'Financial Policy', href: '#' },
          { label: 'Leadership Manual', href: '#' },
          { label: 'Partnership Policies', href: '#' },
        ],
      },
    ],
  },
  {
    title: 'Boards',
    items: [
      { label: 'ICT Board', href: '/boards' },
      { label: 'Media Board', href: '/boards' },
      { label: 'Communication Board', href: '/boards' },
      { label: 'Editorial Board', href: '/boards' },
    ],
  },
  {
    title: 'Evangelistic Teams',
    items: [
      { label: 'RIVET - Rift Valley Evangelistic Team', href: '/ets/rivet' },
      { label: 'ESET - Eastern Evangelistic Team', href: '/ets/eset' },
      { label: 'WESO - Western Evangelistic Students Outreach', href: '/ets/weso' },
      { label: 'NET - Nyanza Evangelistic Team', href: '/ets/net' },
      { label: 'CET - Central Evangelistic Team', href: '/ets/cet' },
    ],
  },
  {
    title: 'Ministries',
    items: [
      { label: 'Praise & Worship', href: '/ministries/praiseAndWorship' },
      { label: 'Choir', href: '/ministries/choir' },
      { label: 'Instrumentalists (Wananzambe)', href: '/ministries/wananzambe' },
      { label: 'High School', href: '/ministries/highSchool' },
      { label: 'Church School', href: '/ministries/churchSchool' },
      { label: 'Compassion', href: '/ministries/compassion' },
      { label: 'Creativity', href: '/ministries/creativity' },
      { label: 'Intercessory', href: '/ministries/intercessory' },
      { label: 'Ushering & Hospitality', href: '/ministries/ushering' },
    ],
  },
  {
    title: 'Fellowships',
    items: [
      {
        label: 'Class Fellowships',
        children: [
          { label: 'First Years', href: '/classFellowship' },
          { label: 'Second Years', href: '/classFellowship' },
          { label: 'Third Years', href: '/classFellowship' },
          { label: 'Fourth Years', href: '/classFellowship' },
        ],
      },
      { label: 'Brothers Fellowship', href: '/brothersfellowship' },
      { label: 'Sisters Fellowship', href: '/sistersfellowship' },
    ],
  },
  {
    title: 'Committees',
    items: [
      { label: 'Sub Executive Committee', href: '/other-committees' },
      { label: 'Sub Committee', href: '/other-committees' },
      { label: 'Software Dev & Maintenance', href: '/other-committees' },
      { label: 'Bible Study Committee', href: '/other-committees' },
      { label: 'Best-P Committee', href: '/other-committees' },
      { label: 'Christian Minds Committee', href: '/christianminds' },
      { label: 'Discipleship Committee', href: '/other-committees' },
      { label: 'Prayer Committee', href: '/other-committees' },
      { label: 'Orientation Committee', href: '/other-committees' },
      { label: 'Strategic Plan Implementation', href: '/other-committees' },
      { label: 'Elders Committee', href: '/elders' },
      { label: 'Development Committee', href: '/other-committees' },
      { label: 'Accounts Committee', href: '/other-committees' },
      { label: 'Worship Committee', href: '/other-committees' },
      { label: 'Missions Committee', href: '/other-committees' },
    ],
  },
  {
    title: 'Classes',
    items: [
      { label: 'Best-P Classes', href: '/bestpClass' },
      { label: 'Discipleship Class', href: '/discipleship' },
    ],
  },
  {
    title: 'Leadership',
    items: [
      { label: 'Executive Committee', href: '/leadership' },
      { label: 'Sub-Committee', href: '/other-committees' },
    ],
  },
];

// Grouped navigation for the Header mega-menu
export const headerNavGroups = {
  services: organizationSections[0], // Quick Access
  organization: [
    organizationSections[1], // Boards
    organizationSections[2], // Evangelistic Teams
    organizationSections[3], // Ministries
    organizationSections[4], // Fellowships
  ],
  governance: [
    organizationSections[5], // Committees
    organizationSections[6], // Classes
    organizationSections[7], // Leadership
  ],
};
