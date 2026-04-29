"use client";

import "../../css/task.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_USER_URL, API_ADMIN_URL, API_AUTH_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import { getSocket } from "../../utils/socket";
import { FaRegBell } from "react-icons/fa6";


interface TaskForm {
  title: string;
  description: string;
  assignedTo: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notification, setNotification] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [notiModal, setIsNotiModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<TaskForm>>({});
  const [users, setUsers] = useState<any[]>([]);

 useEffect(() => {
  if (typeof window === "undefined") return;

  const userCookie = localStorage.getItem("logged_user");
  if (!userCookie) return;

  const parsedUser = JSON.parse(userCookie);

  const socket = getSocket(); // ✅ IMPORTANT
  if (!socket) return;

  // join room
  socket.emit("join", parsedUser.id);

  // 🔔 notification listener
  socket.on("notification:new", (notification) => {
    setNotification((prev) => [notification, ...prev]);
  });

  // 📌 task listener
  socket.on("task:assigned", (task) => {
    setTasks((prev) => [task, ...prev]);
  });

  return () => {
    socket.off("notification:new");
    socket.off("task:assigned");
  };
}, []);

  useEffect(() => {
    const init = async () => {
      const userCookie = localStorage.getItem("logged_user");

      if (!userCookie) {
        return router.push("/signin");
      }

      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);

        let res;
        if (parsedUser.role === "admin") {
          res = await axios.get(`${API_ADMIN_URL}/getalltask`, {
            withCredentials: true,
          });
          if (res?.data.success) {
            setTasks(res.data.data);
          }
        } else {
          res = await axios.get(`${API_USER_URL}/getalltask`, {
            withCredentials: true,
          });
          if (res?.data.success) {
            setTasks(res.data.data.tasks);
            setNotification(res.data.data.notifications)
          }
        }
      } catch (err) {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await axios.put(`${API_USER_URL}/updatetask/${taskId}`, { status: newStatus },
        { withCredentials: true }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_AUTH_URL}/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("logged_user");
      router.push("/signin");

    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  };

  const openModal = async () => {
    try {

      setIsModalOpen(true);
      const res = await axios.get(`${API_ADMIN_URL}/getalluser`, {
        withCredentials: true
      });

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setForm({})
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitTask = async () => {
    try {
      if (!form?.title || !form?.description || !form?.assignedTo) {
        return toast.error("All fields required");
      }

      const res = await axios.post(`${API_ADMIN_URL}/createtask`, form,
        { withCredentials: true }
      );

      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
        closeModal();

        setForm({});
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  };

  const openNotificationHandle = async () => {
    try {
      setIsNotiModal(false);
      await axios.patch(`${API_USER_URL}/notiread`, {}, {
        withCredentials: true
      });
      setNotification((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true
        }))
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="dashboard-title">
        <h1 >Task Dashboard</h1>
        <div className="btnp">
          {user.role === 'admin' ? (
            <button onClick={openModal}>Add Task</button>
          ) : (
            <div className="notiCount">
              <div>{notification.filter(n => !n.isRead).length}</div>
              <FaRegBell onClick={() => setIsNotiModal(true)} size={28} />
            </div>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="no-task">No tasks found</div>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              {user.role === 'admin' && (
                <th>Assigned To</th>
              )}
              <th>Status</th>
              <th>Create Date</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task: any) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                {user.role === 'admin' && (
                  <td>{task.assignedTo?.email}</td>
                )}
                {user.role === 'user' ? (
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                  </td>
                ) : (
                  <td>{task.status}</td>
                )}
                <td>
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter title"
                value={form.title || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter description"
                value={form.description || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign User</Form.Label>

              <Form.Select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
              >
                <option value="">--Select User--</option>

                {users.map((user: any) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button style={{ backgroundColor: "#4f46e5", color: "#fff" }} onClick={handleSubmitTask}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={notiModal} onHide={openNotificationHandle}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="noti">
            {notification.map((item) => (
              <div style={{backgroundColor:item.isRead?"#d8d6f1":"#9590e2"}} key={item._id}>{item.message}</div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

