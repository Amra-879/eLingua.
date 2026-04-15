// src/pages/admin/Professors.jsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import ProfessorForm from "./components/ProfessorForm";
import ProfessorList from "./components/ProfessorList";

const emptyForm = {
  name: "",
  lastName: "",
  email: "",
  password: "",
  language: "",
  bio: "",
};

const emptyEditForm = {
  language: "",
  bio: "",
};

export default function AdminProfessors() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: professors, isLoading: professorsLoading } = useQuery({
    queryKey: ["professors"],
    queryFn: () => api.get("/admin/professors").then((res) => res.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => api.get("/prompts/languages").then((res) => res.data),
    enabled: !!user && user.role === "admin",
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/admin/professors", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["professors"]);
      setForm(emptyForm);
      setSuccess("Profesor uspješno dodan!");
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri dodavanju profesora");
      setSuccess("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/professors/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["professors"]);
      setForm(emptyForm);
      setEditingId(null);
      setSuccess("Profesor uspješno ažuriran!");
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri ažuriranju");
      setSuccess("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/professors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["professors"]);
      setSuccess("Profesor obrisan.");
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri brisanju");
      setSuccess("");
    },
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/");
  }, [user, loading, navigate]);

  if (loading || professorsLoading || languagesLoading) {
    return <p className="p-8">Učitavanje...</p>;
  }
  if (!user || user.role !== "admin") return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: { language: form.language, bio: form.bio },
      });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (professor) => {
    setEditingId(professor.id);
    setForm({
      ...emptyForm,
      language: professor.language_id,
      bio: professor.bio || "",
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Sigurno želiš obrisati ovog profesora?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#00296b] mb-8">
        Upravljanje profesorima
      </h1>

      <div className="flex gap-6 items-start">

        {/* LIJEVO — lista profesora */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-[#00296b] mb-4">
            Svi profesori ({professors?.length ?? 0})
          </h2>
          <ProfessorList
            professors={professors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            editingId={editingId}
          />
        </div>

        {/* DESNO — forma */}
        <div className="w-80 flex-shrink-0 sticky top-24">
          <ProfessorForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            languages={languages}
            isEditing={!!editingId}
            isPending={createMutation.isPending || updateMutation.isPending}
            error={error}
            success={success}
          />
        </div>

      </div>
    </div>
  );
}