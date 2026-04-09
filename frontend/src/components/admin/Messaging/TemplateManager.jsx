import { useState } from "react";
import { Plus, Edit2, Trash2, Mail, MessageSquare, Save, X, Sparkles } from "lucide-react";
import messagingService from "../../../services/messagingService";
import { showSuccess, showError, showLoading, closeLoading, confirmAction } from "../../../utils/alerts";

export default function TemplateManager({ templates, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    channel: "email",
    isActive: true
  });

  const resetForm = () => {
    setFormData({ name: "", subject: "", body: "", channel: "email", isActive: true });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (template) => {
    setFormData({
      name: template.name,
      subject: template.subject || "",
      body: template.body,
      channel: template.channel || "email",
      isActive: template.isActive ?? true
    });
    setEditingId(template.id);
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading(editingId ? "Updating template..." : "Creating template...");
    
    try {
      if (editingId) {
        await messagingService.updateTemplate(editingId, formData);
        showSuccess("Template updated successfully");
      } else {
        await messagingService.createTemplate(formData);
        showSuccess("Template created successfully");
      }
      resetForm();
      onUpdate();
    } catch (error) {
      console.error("Template operation failed", error);
      showError(error?.message || "Failed to save template");
    } finally {
      closeLoading();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction("Are you sure?", "You won't be able to revert this!", "warning", "Yes, delete it!");
    if (!confirmed) return;

    showLoading("Deleting template...");
    try {
      await messagingService.deleteTemplate(id);
      showSuccess("Template deleted successfully");
      onUpdate();
    } catch (error) {
      showError(error?.message || "Failed to delete template");
    } finally {
      closeLoading();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Message Templates</h2>
          <p className="text-gray-500 text-sm">Create and manage your campaign content</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-sm"
          >
            <Plus size={18} />
            New Template
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              {editingId ? "Edit Template" : "New Campaign Template"}
            </h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Template Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Seasonal Promotion"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Preferred Channel</label>
                <div className="flex gap-2">
                  {['email', 'sms', 'multi'].map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setFormData({...formData, channel: ch})}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        formData.channel === ch 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {ch === 'email' && <Mail size={14} />}
                      {ch === 'sms' && <MessageSquare size={14} />}
                      {ch === 'multi' && <Sparkles size={14} />}
                      {ch.charAt(0).toUpperCase() + ch.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Subject Line (Optional)</label>
                <input
                  type="text"
                  placeholder="Subject for email campaigns..."
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Message Body</label>
              <textarea
                required
                placeholder="Support placeholders like {{firstName}}..."
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm leading-relaxed"
              />
              <p className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                Tip: Direct-insert placeholders like <b>{"{{firstName}}"}</b> to personalize
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-200"
            >
              <Save size={18} className="inline mr-2" />
              {editingId ? "Update Template" : "Save Template"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 transition-all group flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${template.channel === 'sms' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {template.channel === 'sms' ? <MessageSquare size={16} /> : <Mail size={16} />}
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {template.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(template)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-1">
                {template.body}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase">
                  {template.channel || 'Email'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${template.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
               <p className="text-gray-400 font-medium">No templates configured yet.</p>
               <button onClick={() => setIsAdding(true)} className="text-emerald-600 font-bold text-sm mt-2 hover:underline">
                 Create your first template
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
