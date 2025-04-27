import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MainFrame from "./MainFrame";

jest.mock("axios");

test("displays 'No Blogs Created' if there are no posts", async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<MainFrame />);

  await waitFor(() => expect(screen.getByText(/No Blogs Created/i)).toBeInTheDocument());
});

test("renders HomePage when posts are available", async () => {
  axios.get.mockResolvedValue({
    data: [{ id: 1, title: "Test Blog", content: "Test Content" }],
  });

  render(<MainFrame />);

  await waitFor(() => expect(screen.getByText(/Blog Posts/i)).toBeInTheDocument());
});
test("handles API errors gracefully", async () => {
  axios.get.mockRejectedValue(new Error("Network Error"));

  render(<MainFrame />);

  await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error fetching posts")));
});
