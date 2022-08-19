export interface Submission {
  action: string;
  method: string;
  formData: FormData;
  encType: string;
  key: string;
}

export class CatchValue {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {}
}

export class TransitionRedirect {
  location: string;
  constructor(location: Location | string, public setCookie: boolean) {
    this.location =
      typeof location === "string"
        ? location
        : location.pathname + location.search;
  }
}