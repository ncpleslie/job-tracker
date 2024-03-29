import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { httpStatusToText } from "../lib/utils/http-status-to-text.util";
import JobResponse from "../models/responses/job.response";
import JobsResponse, {
  JobsResponseJson,
} from "@/models/responses/jobs.response";
import { auth } from "@/constants/firebase";
import { useIdToken } from "react-firebase-hooks/auth";
import { env } from "@/env";
import AppConstants from "@/constants/app.constants";

const getBaseUrl = () => {
  if (import.meta.env.MODE === "production") {
    return env.VITE_API_URL;
  }

  return "/api";
};

/**
 * A hook to get a job by its ID.
 * @param jobId - The job's id.
 */
export const useGetJobByIdQuery = (jobId: string, token?: string) => {
  const [user] = useIdToken(auth);

  return useQuery({
    queryKey: ["getJobById", jobId],
    queryFn: async () => {
      const authToken = token ?? (await user?.getIdToken());

      const response = await fetch(
        `${getBaseUrl()}${AppConstants.JobsApiRoute}${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      return new JobResponse(await response.json());
    },
    enabled: Boolean(jobId),
  });
};

/**
 * A hook to get all jobs.
 */
export const useGetJobsSuspenseQuery = (token?: string) => {
  const [user] = useIdToken(auth);

  return useSuspenseQuery({
    queryKey: ["getJobs"],
    queryFn: async () => {
      const authToken = token ?? (await user?.getIdToken());

      const response = await fetch(
        `${getBaseUrl()}${AppConstants.JobsApiRoute}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }
      const jobs = (await response.json()) as JobsResponseJson;

      return new JobsResponse(jobs).jobs;
    },
  });
};

export const useCreateJobQuery = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["createJob"],
    queryFn: async () => {
      const job = queryClient.getQueryData(["createJob"]) as JobResponse;

      if (job) {
        return job;
      }
    },
    enabled: false,
  });
};

/**
 * A hook to add a job.
 */
export const useAddJobMutation = () => {
  const [user] = useIdToken(auth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      payload: {
        position: string;
        company: string;
        url: string;
        status: string;
        notes?: string;
        image?: string;
      };
      token?: string | null;
    }) => {
      const authToken = request.token ?? (await user?.getIdToken());

      const response = await fetch(
        `${getBaseUrl()}${AppConstants.JobsApiRoute}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(request.payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from stream");
      }

      const readChunk = async () => {
        const { value, done } = await reader.read();
        if (done) {
          return;
        }

        // The ending could contain a trailing newline character,
        // so we need to check for that and remove it.
        const trailingBytes = value.slice(value.length - 3, value.length);
        const endingMarker = [10, 52, 10];
        let valueWithoutNewline = value;
        if (
          trailingBytes.every((value, index) => value === endingMarker[index])
        ) {
          valueWithoutNewline = value.slice(0, value.length - 3);
        }

        const chunkString = new TextDecoder().decode(valueWithoutNewline, {
          stream: true,
        });
        const job = new JobResponse(JSON.parse(chunkString));
        queryClient.setQueryData(["createJob"], () => job);
        queryClient.setQueryData(["getJobById", job.id], () => job);
        queryClient.invalidateQueries({ queryKey: ["getJobs"] });
        queryClient.refetchQueries({ queryKey: ["getJobs"] });

        readChunk();
      };

      readChunk();
    },
  });
};

/**
 * A hook to update a job.
 */
export const useUpdateJobMutation = () => {
  const [user] = useIdToken(auth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      payload: {
        id: string;
        position: string;
        company: string;
        url: string;
        status: string;
        notes?: string;
      };
      token?: string | null;
    }) => {
      const authToken = request.token ?? (await user?.getIdToken());

      const response = await fetch(
        `${getBaseUrl()}${AppConstants.JobsApiRoute}${request.payload.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(request.payload),
        },
      );
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      return new JobResponse(await response.json());
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({
        queryKey: ["getJobs", "getJobById"],
      });
      queryClient.setQueryData(["getJobById", job.id], () => job);
      queryClient.refetchQueries({ queryKey: ["getJobs"] });
    },
  });
};

/**
 * A hook to delete a job by its ID.
 */
export const useDeleteJobMutation = () => {
  const [user] = useIdToken(auth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { jobId: string; token?: string }) => {
      const authToken = payload.token ?? (await user?.getIdToken());

      const response = await fetch(
        `${getBaseUrl()}${AppConstants.JobsApiRoute}${payload.jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getJobs", "getJobById"],
      });
      queryClient.setQueryData(["getJobById", variables], () => null);
      queryClient.refetchQueries({ queryKey: ["getJobs"] });
    },
  });
};
