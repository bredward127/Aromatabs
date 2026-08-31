/**
 * Authors and reviewers.
 *
 * `status: 'pending'` means the role is defined but nobody real holds it yet.
 * The site renders those as an explicit "awaiting review" notice rather than a
 * byline, because a credential nobody actually has is worse than none.
 */

export type Person = {
  id: string;
  name: string;
  role: string;
  /** Credentials, verbatim. Empty until a real person holds the seat. */
  credentials?: string;
  bio: string;
  status: 'active' | 'pending';
  url?: string;
};

export const people: readonly Person[] = [
  {
    id: 'aromatabs-desk',
    name: 'The Aromatabs Desk',
    role: 'Editorial',
    bio: 'Researched and written in-house, then checked against the primary sources before publication.',
    status: 'active',
  },
  {
    id: 'clinical-review-pending',
    name: 'Clinical review pending',
    role: 'Reviewer',
    bio: 'This guide has been written and sourced but not yet signed off by a clinician. Named reviewers and their credentials will be listed here before launch.',
    status: 'pending',
  },
] as const;

export const peopleIds = people.map((p) => p.id);

export function findPerson(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}
