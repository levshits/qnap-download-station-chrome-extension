import { QnapConnectionString } from "./Models";

export type LoginResponseModel = BaseResponseModel & {
  user: string;
  sid: string;
};

export type BaseResponseModel = {
  error: number;
  reason?: string;
};

export type DownloadJobsListResponseModel = BaseResponseModel & {
  data: DownloadJobModel[];
  status: DownloadStationStatusModel;
  total: number;
};

export type DownloadJobModel = {
  activity_time: number;
  caller: string;
  caller_meta: string;
  category: number;
  choose_files: number;
  comment: string;
  create_time: string;
  done: number;
  down_rate: number;
  down_size: number;
  error: number;
  eta: number;
  finish_time: string;
  hash: string;
  move: string;
  path: string;
  peers: number;
  priority: number;
  progress: number;
  seeds: number;
  share: number;
  size: number;
  source: string;
  source_name: string;
  start_time: string;
  state: number;
  temp: string;
  total_down: number;
  total_files: number;
  total_up: number;
  type: string;
  uid: number;
  up_rate: number;
  up_size: number;
  username: string;
  wakeup_time: string;
};

export type DownloadStationStatusModel = {
  active: number;
  all: number;
  bt: number;
  completed: number;
  down_rate: number;
  downloading: number;
  inactive: number;
  paused: number;
  seeding: number;
  stopped: number;
  up_rate: number;
  url: number;
};

export class QnapService {
  post<TResponse>(url: string, body: any) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: new URLSearchParams(Object.entries(body)).toString(),
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (!!json.error) {
          return Promise.reject(json);
        }

        return json as TResponse;
      });
  }

  login(settings: QnapConnectionString): any {
    if (!!settings) {
      return this.post<LoginResponseModel>(
        settings.url + "/downloadstation/V4/Misc/Login",
        {
          user: settings.username,
          pass: btoa(settings.password),
        }
      );
    }

    throw new Error("No settings provided");
  }

  getDownloadJobsList(settings: QnapConnectionString, sid: string) {
    if (!!settings && !!sid) {
      return this.post<DownloadJobsListResponseModel>(
        settings.url + "/downloadstation/V4/Task/Query",
        {
          sid: sid,
          limit: 0,
          status: "all",
          type: "all",
        }
      );
    }
    throw new Error("Connection is not initialized");
  }

  addDownloadJob(
    settings: QnapConnectionString,
    sid: string,
    job: {
      tempFolder: string;
      targetFolder: string;
      url: string;
    }
  ) {
    if (!!settings && !!sid) {
      return this.post<BaseResponseModel>(
        settings.url + "/downloadstation/V4/Task/AddUrl",
        {
          sid: sid,
          temp: job.tempFolder,
          move: job.targetFolder,
          url: job.url,
        }
      );
    }
  }
}

export const qnapService = new QnapService();
