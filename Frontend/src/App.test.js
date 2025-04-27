import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Root from "./Blog/Root";
import MainFrame from "./Blog/MainFrame";
import CreatePost from "./Blog/CreatePost";
import PostPage from "./Blog/PostPage";
import EditPost from "./Blog/EditPost";

test("renders MainFrame at root path", () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Root />,
        children: [
          { path: "/", element: <MainFrame /> },
          { path: "/create", element: <CreatePost /> },
          { path: "/posts/:id", element: <PostPage /> },
          { path: "/edit/:id", element: <EditPost /> },
        ],
      },
    ],
    { initialEntries: ["/"] } // Simulate navigating to root
  );

  render(<RouterProvider router={router} />);

  expect(screen.getByText(/MainFrame/i)).toBeInTheDocument();
});

test("renders CreatePost at /create", () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Root />,
        children: [{ path: "/create", element: <CreatePost /> }],
      },
    ],
    { initialEntries: ["/create"] } // Simulate navigating to /create
  );

  render(<RouterProvider router={router} />);

  expect(screen.getByText(/CreatePost/i)).toBeInTheDocument();
});

test("renders PostPage at /posts/:id", () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Root />,
        children: [{ path: "/posts/:id", element: <PostPage /> }],
      },
    ],
    { initialEntries: ["/posts/1"] } // Simulate navigating to a post
  );

  render(<RouterProvider router={router} />);

  expect(screen.getByText(/Blog Loading, Wait a moment/i)).toBeInTheDocument();
});

test("renders EditPost at /edit/:id", () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Root />,
        children: [{ path: "/edit/:id", element: <EditPost /> }],
      },
    ],
    { initialEntries: ["/edit/1"] } // Simulate navigating to edit page
  );

  render(<RouterProvider router={router} />);

  expect(screen.getByText(/EditPost/i)).toBeInTheDocument();
});
