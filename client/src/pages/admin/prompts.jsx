import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import PromptForm from "./components/PromptForm";
import PromptList from "./components/PromptList";

const emptyForm = { title: "", question: "", language: "", level: "" };

export default function AdminPrompts() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: prompts, isLoading: promptsLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => api.get("/prompts").then((res) => res.data),
    enabled: !!user && user.role === "admin",
  });

  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => api.get("/prompts/languages").then((res) => res.data),
    enabled: !!user && user.role === "admin",
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/prompts", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["prompts"]);
      setForm(emptyForm);
      setSuccess("Prompt uspješno kreiran!");
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri kreiranju");
      setSuccess("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/prompts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["prompts"]);
      setForm(emptyForm);
      setEditingId(null);
      setSuccess("Prompt uspješno ažuriran!");
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri ažuriranju");
      setSuccess("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/prompts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["prompts"]);
      setSuccess("Prompt obrisan.");
      setError("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri brisanju");
      setSuccess("");
    },
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "admin") return null;
  if (promptsLoading || languagesLoading) return <p className="p-8">Učitavanje promptova...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (prompt) => {
    setEditingId(prompt.id);
    setForm({
      title: prompt.title,
      question: prompt.question,
      language: prompt.language_id,
      level: prompt.level,
    });
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Sigurno želiš obrisati ovaj prompt?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#00296b] mb-8">
        Upravljanje promptovima
      </h1>

      <div className="flex gap-6 items-start">

        {/* LIJEVO — lista promptova */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-[#00296b] mb-4">
            Svi promptovi ({prompts?.length ?? 0})
          </h2>
          <PromptList
            prompts={prompts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            editingId={editingId}
          />
        </div>

        {/* DESNO — forma */}
        <div className="w-80 flex-shrink-0 sticky top-24">
          <PromptForm
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