"use client";
import { QuoteType } from "@/utils/types";
import { Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type Props = {};
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Form = ({}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteType>();
  const [toatOpen, setToatOpen] = useState(false);

  const AddQuote = async (data: QuoteType) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/quotes/",
        data
      );

      if (response.data.status) {
        setToatOpen(true);
        reset();
      }
    } catch (error) {
      console.log(error);
      console.log(errors);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setToatOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit(AddQuote)}
      className="grid grid-flow-row gap-8 w-[400px]"
    >
      <Snackbar
        open={toatOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Quote is successfully created!!
        </Alert>
      </Snackbar>
      <Typography variant="h3" gutterBottom className="text-center font-bold">
        Add Quote
      </Typography>
      <TextField
        label="Date"
        variant="outlined"
        placeholder="Add date here..."
        error={errors.date ? true : false}
        helperText={errors.date?.type === "required" ? "Date is Required" : ""}
        {...register("date", { required: true })}
      />
      <TextField
        label="Video link"
        variant="outlined"
        placeholder="Add link of the video here..."
        error={errors.video_link ? true : false}
        helperText={
          errors.video_link?.type === "required" ? "Video link is Required" : ""
        }
        {...register("video_link", { required: true })}
      />
      <TextField
        label="Quote"
        multiline
        rows={5}
        placeholder="Add Quote here..."
        error={errors.quote ? true : false}
        helperText={
          errors.quote?.type === "required" ? "Quote is Required" : ""
        }
        {...register("quote", { required: true })}
      />
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingIndicator="Submiting..."
        variant="contained"
        className="bg-blue-700"
        size="large"
      >
        Submit
      </LoadingButton>
    </form>
  );
};

export default Form;
