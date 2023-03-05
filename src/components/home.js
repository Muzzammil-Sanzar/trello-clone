import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import Navbar from "./Nav";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* ******************************** MATERIAL UI IMPORTS *************************************** */
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
// import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import Add from "@mui/icons-material/Add";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontWeight: 550,
  fontSize: "0.9rem",
}));

function Home() {
  const [open, setOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  // const [alertdisplay, setAlertdisplay] = useState("none");
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [descrip, setDescrip] = useState("");
  const [addCard, setAddCard] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newBoard, setNewBoard] = useState("");
  const [data, setData] = useState([]);
  const [taskdes, setTaskdes] = useState("");
  const [count, setCount] = useState(0);
  const [boardId, setBoardId] = useState("");

  const inputRef = useRef(null);

  const token = useSelector((state) => state.token);
  let navigate = useNavigate();

  const handleClickOpen = (event, title, description, id) => {
    setOpen(true);
    setTaskdes("");
    setTitle(title);
    setDescrip(description);
    setBoardId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleupdateclose = () => {
    setUpdateOpen(false);
  };

  const handleClickUpdateTask = (event, id, title) => {
    setUpdateOpen(true);
    setTitle(title);
    setNewTitle("");
    setBoardId(id);
  };

  const handleClickButton = async (event, id) => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (addCard === "") {
      setError(true);
    }
    if (event.target.id === id) {
      await axios
        .post(
          `http://localhost:5000/boards/tasks/add`,
          {
            id: id,
            title: addCard,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setCount(count + 1);
          console.log("data added", res.data);
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    }
  };

  const handleClickDeleteTask = async (event, id, title) => {
    console.log("id is ", id, "title is ", title);
    await axios
      .put(
        `http://localhost:5000/boards/title/delete`,
        { id: id, title: title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setCount(count + 1);
        console.log(res);
      })
      .catch((err) => {
        console.log("error is ", err);
      });
  };

  const handleClickDeleteIcon = async (event, id) => {
    await axios
      .delete(`http://localhost:5000/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCount(count + 1);
        console.log("data is: ", res);
      })
      .catch((err) => {
        console.log("error is: ", err);
      });
    console.log("you clicked delete button", id);
  };

  const handleClickAddList = () => {
    setIsLoading(!isLoading);
  };

  const handleClickSaveList = async () => {
    setIsLoading(false);
    await axios
      .post(
        `http://localhost:5000/boards/add`,
        { title: newBoard },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setCount(count + 1);
        console.log(res);
      })
      .catch((err) => {
        console.log("error is: ", err);
      });
  };

  const handleChange = (event) => {
    setTaskdes(event.target.value);
  };

  const handleClickDes = async (event) => {
    if (taskdes !== "") {
      await axios
        .put(
          `http://localhost:5000/boards/des/add`,
          { id: boardId, title: title, description: taskdes },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setOpen(false);
          setCount(count + 1);
        })
        .catch((err) => console.log("error is: ", err));
    }
    console.log(taskdes, boardId, title);
  };

  const handleClickUpdateTitle = async () => {
    if (newTitle !== "") {
      await axios
        .put(
          `http://localhost:5000/boards/title/edit`,
          { id: boardId, title: title, newTitle: newTitle },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setUpdateOpen(false);
          setCount(count + 1);
        })
        .catch((err) => console.log(err));
    }
    console.log(title, newTitle, boardId);
  };

  const onDrag = async (result, data, setData) => {
    const { source, destination } = result;
    if (!result.destination) return;
    console.log("result is: ", result);
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = data.filter((a) => a._id === source.droppableId);
      const destinationColumn = data.filter(
        (a) => a._id === destination.droppableId
      );
      const sourceItems = [...sourceColumn[0].tasks];
      const destinationItems = [...destinationColumn[0].tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      sourceColumn[0].tasks = sourceItems;
      destinationColumn[0].tasks = destinationItems;
      await axios
        .put(
          `http://localhost:5000/boards/tasks/update/${source.droppableId}`,
          sourceItems,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => console.log("source items updated."));
      await axios
        .put(
          `http://localhost:5000/boards/tasks/update/${destination.droppableId}`,
          destinationItems,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => console.log("destination items updated"));
      setCount(count + 1);
      console.log("result is: ", result);
      console.log("removed item is: ", removed);
      console.log("destination items are: ", destinationItems);
      console.log("source items are: ", sourceItems);
      console.log("destination column is", destinationColumn);
      console.log("source column is: ", sourceColumn);
      console.log("Data is: ", data);
    } else {
      const column = data.filter((a) => a._id === source.droppableId);
      const columnItems = [...column[0].tasks];
      const [removed] = columnItems.splice(source.index, 1);
      columnItems.splice(destination.index, 0, removed);
      column[0].tasks = columnItems;
      await axios
        .put(
          `http://localhost:5000/boards/tasks/update/${source.droppableId}`,
          columnItems,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => console.log("tasks updated!!!"));
      console.log("column is: ", column);
      console.log("column items are: ", columnItems);
      console.log("removed item is: ", removed);
      console.log("data is: ", data);
    }
  };

  const getData = async () => {
    await axios(`http://localhost:5000/boards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    token === null ? navigate("/login") : getData();
  }, [count]);

  return (
    <div
      style={{ backgroundColor: "rgba(218, 226, 182, 0.6)", height: "100vh" }}
    >
      <Navbar />
      <section
        style={{ backgroundColor: "rgba(218, 226, 182, 0.1)", marginTop: 30 }}
      >
        <DragDropContext onDragEnd={(result) => onDrag(result, data, setData)}>
          <ScrollMenu>
            {data.map((items) => {
              return (
                <Stack direction="row" spacing={2} m={2} key={items._id}>
                  <Droppable droppableId={items._id} key={items._id}>
                    {(provided) => {
                      return (
                        <Box
                          sx={{ width: 310 }}
                          key={items._id}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <Card
                            sx={{ backgroundColor: "rgba(234, 246, 246, 0.5)" }}
                            key={items._id}
                          >
                            <CardHeader
                              title={items.title}
                              action={
                                <IconButton
                                  aria-label="settings"
                                  onClick={(e) =>
                                    handleClickDeleteIcon(e, items._id)
                                  }
                                >
                                  <DeleteForeverRoundedIcon />
                                </IconButton>
                              }
                              key={items._id}
                            />
                            <CardContent key={items.id}>
                              {items.tasks.map((item, index) => {
                                return (
                                  <>
                                    <Draggable
                                      key={item.title}
                                      draggableId={item.title}
                                      index={index}
                                    >
                                      {(provided) => {
                                        return (
                                          <Stack
                                            direction="row"
                                            key={item.title}
                                            sx={{
                                              alignItems: "center",
                                              ...provided.draggableProps.style,
                                            }}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <Item
                                              sx={{
                                                width: "100%",
                                                marginTop: 2,
                                                color: "#7F8487",
                                                letterSpacing: "0.1rem",
                                                display: "inline-flex",
                                                flex: "grow shrink basis",
                                                alignItems: "center",
                                              }}
                                              key={item.title}
                                            >
                                              <span
                                                onClick={(event) =>
                                                  handleClickOpen(
                                                    event,
                                                    item.title,
                                                    item.description,
                                                    items._id
                                                  )
                                                }
                                              >
                                                {item.title}
                                              </span>
                                              <IconButton
                                                aria-label="settings"
                                                onClick={(e) =>
                                                  handleClickDeleteTask(
                                                    e,
                                                    items._id,
                                                    item.title
                                                  )
                                                }
                                                sx={{
                                                  marginLeft: "auto",
                                                  order: 2,
                                                }}
                                              >
                                                <DeleteForeverRoundedIcon />
                                              </IconButton>
                                              <IconButton
                                                aria-label="settings"
                                                onClick={(e) =>
                                                  handleClickUpdateTask(
                                                    e,
                                                    items._id,
                                                    item.title
                                                  )
                                                }
                                                sx={{ order: 3 }}
                                              >
                                                <DriveFileRenameOutlineRoundedIcon />
                                              </IconButton>
                                            </Item>
                                          </Stack>
                                        );
                                      }}
                                    </Draggable>
                                  </>
                                );
                              })}
                              <Input
                                error={error}
                                inputRef={inputRef}
                                sx={{ width: "90%", marginTop: 1 }}
                                onChange={(e) => setAddCard(e.target.value)}
                              />
                              <Button
                                id={items._id}
                                onClick={(e) => handleClickButton(e, items._id)}
                                sx={{
                                  color: "#7F8487",
                                  width: "90%",
                                  textAlign: "left",
                                  letterSpacing: ".3rem",
                                  marginTop: 1,
                                }}
                              >
                                <Add sx={{ mr: 1 }} /> Add a Card
                              </Button>
                            </CardContent>
                          </Card>
                          {provided.placeholder}
                        </Box>
                      );
                    }}
                  </Droppable>
                </Stack>
              );
            })}
            <Box mt={2}>
              {isLoading && (
                <>
                  <Input
                    sx={{ display: "flex", marginBottom: 2 }}
                    onChange={(e) => setNewBoard(e.target.value)}
                  />
                  <Button
                    onClick={handleClickSaveList}
                    sx={{
                      width: 250,
                      color: "#7F8487",
                      letterSpacing: "0.2rem",
                    }}
                  >
                    Save List
                  </Button>
                </>
              )}
              {!isLoading && (
                <Button
                  onClick={handleClickAddList}
                  sx={{ width: 250, color: "#7F8487", letterSpacing: "0.2rem" }}
                >
                  {" "}
                  <Add /> Add Another List
                </Button>
              )}
            </Box>
          </ScrollMenu>
        </DragDropContext>
      </section>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <TextareaAutosize
              minRows={3}
              placeholder="Enter description here"
              defaultValue={descrip}
              onChange={handleChange}
              style={{
                padding: 4,
                width: "70%",
                border: "2px solid rgba(43, 72, 101, 0.6)",
              }}
            />
            <Button
              variant="outlined"
              onClick={(e) => handleClickDes(e)}
              sx={{ width: "30%" }}
            >
              Add
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={updateOpen} onClose={handleupdateclose}>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <p>Enter new title!</p>
            <TextField
              id="standard-basic"
              defaultValue={title}
              variant="standard"
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button variant="outlined" onClick={handleClickUpdateTitle}>
              update
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Home;
