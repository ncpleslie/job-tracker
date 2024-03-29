import { JobFormValues } from "@/constants/job-form.constants";
import { useAddJobMutation, useCreateJobQuery } from "./use-query.hook";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const useAddJob = (token?: string | null) => {
  const [jobImage, setJobImage] = useState<string | undefined>();
  const { data } = useCreateJobQuery();
  const { mutate, isPending } = useAddJobMutation();
  const router = useRouter();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate({
        to: "/jobs/$jobId",
        params: { jobId: data.id },
        replace: true,
      });
    }
  }, [data, navigate]);

  const onSubmit = (values: JobFormValues) => {
    mutate({
      payload: {
        ...values,
        image: jobImage,
      },
      token,
    });
  };

  const onClose = () => {
    router.history.back();
  };

  return { onSubmit, onClose, setJobImage, jobImage, isPending };
};

export default useAddJob;
