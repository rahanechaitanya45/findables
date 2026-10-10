export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  active: boolean;
  source: string;
}

class NewsletterService {
  private subscribers: Subscriber[] = [
    {
      id: 'sub-1',
      email: 'aakash.sharma@example.com',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      active: true,
      source: 'instagram_bio_landing',
    },
    {
      id: 'sub-2',
      email: 'priya.techfinds@example.com',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      active: true,
      source: 'footer_signup',
    },
  ];

  public isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim().toLowerCase());
  }

  public subscribe(email: string, source: string = 'homepage'): { success: boolean; message: string; isDuplicate?: boolean } {
    const cleanEmail = email.trim().toLowerCase();
    if (!this.isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const existing = this.subscribers.find((s) => s.email === cleanEmail);
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
      }
      return { success: true, message: "You're already subscribed! Look out for my weekly drops.", isDuplicate: true };
    }

    const newSub: Subscriber = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      active: true,
      source,
    };

    this.subscribers.unshift(newSub);
    return { success: true, message: 'Thanks for subscribing! You’ll receive my top curated Amazon India picks every Sunday.' };
  }

  public unsubscribe(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.subscribers.find((s) => s.email === cleanEmail);
    if (!existing) {
      return { success: false, message: 'Email address not found in subscriber list.' };
    }
    existing.active = false;
    return { success: true, message: 'You have been unsubscribed successfully.' };
  }

  public getSubscribers(): Subscriber[] {
    return this.subscribers;
  }

  public getCount(): { total: number; active: number } {
    const active = this.subscribers.filter((s) => s.active).length;
    return { total: this.subscribers.length, active };
  }

  public exportCsv(): string {
    const headers = ['ID', 'Email', 'Subscribed At', 'Active', 'Source'];
    const rows = this.subscribers.map((s) => [s.id, s.email, s.createdAt, s.active ? 'Yes' : 'No', s.source]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const newsletterService = new NewsletterService();
