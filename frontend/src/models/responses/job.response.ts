export type JobResponseJson = {
  id: string;
  position: string;
  company: string;
  url: string;
  image_filename?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  statuses: StatusResponseJson[];
  notes?: string;
};

export type StatusResponseJson = {
  status: string;
  created_at: string;
};

export default class JobResponse {
  constructor(data: JobResponseJson) {
    this.id = data.id;
    this.position = data.position;
    this.company = data.company;
    this.url = data.url;
    this.imageFilename = data.image_filename;
    this.imageUrl = data.image_url;
    this.createdAt = this.dateStringToTimeAndDate(data.created_at);
    this.updatedAt = data.updated_at
      ? this.dateStringToTimeAndDate(data.updated_at)
      : undefined;

    const mostRecentStatus = data.statuses.reduce((r, o) =>
      new Date(o.created_at) > new Date(r.created_at) ? o : r,
    );
    this.status = mostRecentStatus.status;
    this.notes = data.notes;
  }

  public id: string;
  public position: string;
  public company: string;
  public url: string;
  public imageFilename?: string;
  public imageUrl?: string;
  public createdAt: string;
  public updatedAt?: string;
  public status: string;
  public notes?: string;

  private dateStringToTimeAndDate(date: string) {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleTimeString()} - ${dateObj.toLocaleDateString()}`;
  }
}
