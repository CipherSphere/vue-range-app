export interface Lane {
    id: number;
    status: 'Executive' | 'Instructor' | 'Member' | 'Guest' | 'Down' | 'Open';
    started_at: string | null;
}  