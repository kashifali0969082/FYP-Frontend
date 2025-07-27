// src/apiclient/QuizGeneratorapi.js
import axios from "axios";
import { apiclient } from "./Apis";

export const quizgenerateapi = async ({
  user_query,
  difficulty_level,
  num_mcqs,
  explanation,
}) => {
  try {
    const response = await apiclient.post(`quiz-gen`, {
      user_query,
      difficulty_level,
      num_mcqs,
      explanation,
    });

    // Ensure it returns the structure: { status: "success", generated_mcqs: [...] }
    return {
      success: response.data.status === "success",
      data: response.data,
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
