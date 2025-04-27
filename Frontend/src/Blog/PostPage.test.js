import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import PostPage from "./PostPage";

jest.mock("axios");

describe("PostPage Component", () => {
  const mockPost = { id: "1", title: "Test Post", content: "This is a test post", summary: "Test summary" };

  test("renders loading message while fetching post", async () => {
    axios.get.mockResolvedValue({ data: mockPost });

    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Blog Loading, Wait a moment/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(mockPost.title)).toBeInTheDocument());
  });

  test("displays post details when fetched", async () => {
    axios.get.mockResolvedValue({ data: mockPost });

    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(mockPost.title)).toBeInTheDocument());
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
    expect(screen.getByText(mockPost.summary)).toBeInTheDocument();
  });
  test("displays fallback text when summary and content are missing", async () => {
    axios.get.mockResolvedValue({ data: { id: "1", summary: "", content: "" } });

    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText(/No summary available/i)).toBeInTheDocument();
    });
});


  test("handles API errors gracefully", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    
    axios.get.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error fetching post")));

    consoleErrorMock.mockRestore();
  });

  test("deletes post and redirects on delete", async () => {
    axios.get.mockResolvedValue({ data: mockPost });
    axios.delete.mockResolvedValue({});

    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    await (waitFor)(() => expect(screen.getByText(mockPost.title)).toBeInTheDocument());

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });
  test("shows error when deleting fails", async () => {
    axios.get.mockResolvedValue({ data: mockPost });
    axios.delete.mockRejectedValue(new Error("Delete failed"));
  
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
  
    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => expect(screen.getByText(mockPost.title)).toBeInTheDocument());
  
    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);
  
    // Ensure console.error was called with an error message containing "Delete failed"
    await waitFor(() =>
      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error "))
    );
  
    consoleErrorMock.mockRestore();
  });
})  