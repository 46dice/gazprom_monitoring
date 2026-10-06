type SearchParams = Record<string, string | number | undefined>;

type RequestOptions = {
  params?: SearchParams;
  signal?: AbortSignal;
};

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** Бэкенд только отдаёт данные — нужен лишь GET. */
export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  url(endpoint: string, params?: SearchParams): string {
    const url = `${this.baseUrl}/${endpoint}`;
    if (!params) return url;

    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) search.set(key, String(value));
    }

    const query = search.toString();
    return query ? `${url}?${query}` : url;
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(this.url(endpoint, options.params), {
      signal: options.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new HttpError(response.status, await this.readError(response));
    }

    return (await response.json()) as T;
  }

  private async readError(response: Response): Promise<string> {
    // FastAPI кладёт текст ошибки в detail (например, 503 «Файл не найден»).
    try {
      const body = (await response.json()) as { detail?: unknown };
      return typeof body.detail === "string" ? body.detail : response.statusText;
    } catch {
      return response.statusText;
    }
  }
}
