import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import CreatePost from "./CreatePost";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CreatePost Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("CREATE NEW POST")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter title ...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Content ......")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("navigates to home on clicking cancel button", async () => {
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });

  test("shows an alert if fields are empty", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Create"));
    expect(window.alert).toHaveBeenCalledWith("Fill complete details to create a post");

    window.alert.mockRestore();
  });
  test("shows an alert if title is empty but content is filled", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByPlaceholderText("Enter Content ......"), { target: { value: "Some content" } });
    fireEvent.click(screen.getByText("Create"));
  
    expect(window.alert).toHaveBeenCalledWith("Fill complete details to create a post");
  
    window.alert.mockRestore();
  });
  
  test("shows an alert if content is empty but title is filled", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByPlaceholderText("Enter title ..."), { target: { value: "Some title" } });
    fireEvent.click(screen.getByText("Create"));
  
    expect(window.alert).toHaveBeenCalledWith("Fill complete details to create a post");
  
    window.alert.mockRestore();
  });

  test("shows an alert if both title and content  is empty", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByPlaceholderText("Enter title ..."), { target: { value: " " } });
    fireEvent.change(screen.getByPlaceholderText("Enter Content ......"), { target: { value: " " } });
    fireEvent.click(screen.getByText("Create"));
  
    expect(window.alert).toHaveBeenCalledWith("Fill complete details to create a post");
  
    window.alert.mockRestore();
  });
  

  test("submits form successfully and navigates to home", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter title ..."), { target: { value: "Test Title" } });
    fireEvent.change(screen.getByPlaceholderText("Enter Content ......"), { target: { value: "Test Content" } });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("https://blogpost1-nxy5.onrender.com/posts", {
        title: "Test Title",
        content: "Test Content",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("displays alert if API request fails", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter title ..."), { target: { value: "Test Title" } });
    fireEvent.change(screen.getByPlaceholderText("Enter Content ......"), { target: { value: "Test Content" } });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to create post. Please try again.");
    });

    window.alert.mockRestore();
  });
});
