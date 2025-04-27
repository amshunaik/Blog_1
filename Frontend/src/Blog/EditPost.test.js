import React from "react";
import {render,screen,waitFor,fireEvent} from "@testing-library/react";
import {MemoryRouter, memoryRouter, Route, Routes, useNavigate} from "react-router-dom"
import axios from "axios"
import EditPost from "./EditPost";
import { useParams } from "react-router-dom";

jest.mock("axios");

const mockNavigate=jest.fn();
const useParams=({id:"123"});
jest.mock("react-router-dom",()=>({
    ...jest.requireActual("react-router-dom"),
    useNavigate:()=>mockNavigate,useParams
}));

describe("Edit post ",()=>{

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    test("renders correctly",async()=>{
        axios.get.mockResolvedValue({
            data: { title: "Test Title", content: "Test Content" },
          });
        render(
            <MemoryRouter initialEntries={["/edit"]}>
                <Routes>
                    <Route path="/edit" element={<EditPost/>}/>
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        expect(screen.getByText("EDIT BLOG")).toBeInTheDocument();
        expect(screen.getByText("Update")).toBeInTheDocument();
       
    expect(screen.getByLabelText(/title/i)).toHaveValue("Test Title");
    expect(screen.getByLabelText(/content/i)).toHaveValue("Test Content");

    });
    test("fetches post data and updates state (setdata)", async () => {
        const mockPostData = { title: "Mock Title", content: "Mock Content" };
    
        axios.get.mockResolvedValue({ data: mockPostData });
    
        render(
          <MemoryRouter>
            <EditPost />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          // Ensure API call was made
          expect(axios.get).toHaveBeenCalledWith(
            "https://blogpost1-nxy5.onrender.com/posts/123"
          );
        });
    
        // Verify that fetched data is reflected in state (setdata)
        expect(screen.getByLabelText(/title/i)).toHaveValue(mockPostData.title);
        expect(screen.getByLabelText(/content/i)).toHaveValue(mockPostData.content);
      });
      test("Handles API get request error gracefully", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress error logs
      
        axios.get.mockRejectedValue(new Error("Network error"));
      
        render(
          <MemoryRouter>
            <EditPost />
          </MemoryRouter>
        );
      
        await waitFor(() => {
          expect(axios.get).toHaveBeenCalledWith(
            "https://blogpost1-nxy5.onrender.com/posts/123"
          );
        });
      
        // Check if the component handles the error (modify based on implementation)
        expect(console.error).toHaveBeenCalled(); // Ensures error is logged
      
        console.error.mockRestore(); // Restore console after test
      });
      
      test("Updating the title and content", async () => {
        // Mock useParams to return a specific ID
        useParams.mockReturnValue({ id: "123" });
      
        // Mock axios.put response
        axios.put.mockResolvedValue({ data: { success: true } });
      
        render(
          <MemoryRouter initialEntries={["/edit"]}>
            <Routes>
              <Route path="/edit" element={<EditPost />} />
            </Routes>
          </MemoryRouter>
        );
      
        // Update input fields before submitting
        fireEvent.change(screen.getByRole("textbox", { name: /title/i }), {
          target: { value: "Test title" },
        });
        fireEvent.change(screen.getByRole("textbox", { name: /content/i }), {
          target: { value: "Test Content" },
        });
      
        // Click the Update button
        fireEvent.click(screen.getByText("Update"));
      
        await waitFor(() => {
          expect(axios.put).toHaveBeenCalledWith(
            "https://blogpost1-nxy5.onrender.com/posts/123",
            { title: "Test title", content: "Test Content" }
          );
        });
      
        // Check if navigation happened
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/posts/123");
        });
      });

    test("Error in put request",async()=>{
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress error logs

        axios.put.mockRejectedValue(new Error("Network Error"));
        render(
            <MemoryRouter initialEntries={["/edit"]}>
                <Routes>
                    <Route path="/edit" element={<EditPost/>}/>
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Update"));
        expect(console.error).toHaveBeenCalled(); // Ensures error is logged

        
        console.error.mockRestore();

        //expect(mockNavigate).toHaveBeenCalledWith(`/posts/${id}`);
    });
    test("updates title and content on user input", async () => {
        axios.get.mockResolvedValue({
          data: { title: "Old Title", content: "Old Content" },
        });
    
        render(
          <MemoryRouter>
            <EditPost />
          </MemoryRouter>
        );
    
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    
        const titleInput = screen.getByLabelText(/title/i);
        const contentInput = screen.getByLabelText(/content/i);
    
        fireEvent.change(titleInput, { target: { value: "New Title" } });
        fireEvent.change(contentInput, { target: { value: "New Content" } });
    
        expect(titleInput).toHaveValue("New Title");
        expect(contentInput).toHaveValue("New Content");
      });
    
      test("calls API on update button click", async () => {
        axios.get.mockResolvedValue({
          data: { title: "Old Title", content: "Old Content" },
        });
        axios.put.mockResolvedValue({ data: { message: "Updated" } });
    
        render(
          <MemoryRouter>
            <EditPost />
          </MemoryRouter>
        );
    
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    
        const updateButton = screen.getByRole("button", { name: /update/i });
    
        fireEvent.click(updateButton);
    
        await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
        expect(axios.put).toHaveBeenCalledWith(
          "https://blogpost1-nxy5.onrender.com/posts/123",
          { title: "Old Title", content: "Old Content" }
        );
      });
    


})