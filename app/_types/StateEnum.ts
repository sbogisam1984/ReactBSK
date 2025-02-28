export enum StateEnum {
  AL = 'Alabama',
  AK = 'Alaska',
  AZ = 'Arizona',
  AR = 'Arkansas',
  CA = 'California',
  CO = 'Colorado',
  CT = 'Connecticut',
  DE = 'Delaware',
  FL = 'Florida',
  GA = 'Georgia',
  HI = 'Hawaii',
  ID = 'Idaho',
  IL = 'Illinois',
  IN = 'Indiana',
  IA = 'Iowa',
  KS = 'Kansas',
  KY = 'Kentucky',
  LA = 'Louisiana',
  ME = 'Maine',
  MD = 'Maryland',
  MA = 'Massachusetts',
  MI = 'Michigan',
  MN = 'Minnesota',
  MS = 'Mississippi',
  MO = 'Missouri',
  MT = 'Montana',
  NE = 'Nebraska',
  NV = 'Nevada',
  NH = 'New Hampshire',
  NJ = 'New Jersey',
  NM = 'New Mexico',
  NY = 'New York',
  NC = 'North Carolina',
  ND = 'North Dakota',
  OH = 'Ohio',
  OK = 'Oklahoma',
  OR = 'Oregon',
  PA = 'Pennsylvania',
  RI = 'Rhode Island',
  SC = 'South Carolina',
  SD = 'South Dakota',
  TN = 'Tennessee',
  TX = 'Texas',
  UT = 'Utah',
  VT = 'Vermont',
  VA = 'Virginia',
  WA = 'Washington',
  WV = 'West Virginia',
  WI = 'Wisconsin',
  WY = 'Wyoming',
  DC = 'District of Columbia',
  AS = 'American Samoa',
  GU = 'Guam',
  MP = 'Northern Mariana Islands',
  PR = 'Puerto Rico',
  VI = 'U.S. Virgin Islands',
  UM = 'United States Minor Outlying Islands',
  FM = 'Federated States of Micronesia',
  MH = 'Marshall Islands',
  PW = 'Palau',
}

export const getFullStateName = (abbreviation: string): string => {
  const stateEntry = Object.entries(StateEnum).find(([key]) => key === abbreviation);
  return stateEntry ? stateEntry[1] : '';
};

export const getStateAbbreviation = (fullName: string | undefined): string => {
  if (!fullName) {
    return '';
  }
  const entry = Object.entries(StateEnum).find(([_, value]) => value === fullName);
  return entry ? entry[0] : fullName; // Return the full name if no abbreviation is found
};
