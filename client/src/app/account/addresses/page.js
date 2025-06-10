"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddressForm from "@/components/AddressForm";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  CheckCircle,
  Phone,
} from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetchApi("/users/addresses", {
        credentials: "include",
      });

      if (response.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form success
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  // Handle delete address
  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetchApi(`/users/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle set default address
  const handleSetDefaultAddress = async (id) => {
    try {
      const response = await fetchApi(`/users/addresses/${id}/default`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.success) {
        toast.success("Default address updated");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(error.message || "Failed to set default address");
    }
  };

  // Loading state
  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Loading Addresses...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-10 text-white shadow-xl border-2 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">My Addresses</h1>
            <p className="text-red-100 text-lg">Manage your delivery addresses for faster checkout</p>
          </div>
          <div className="bg-white/30 p-4 rounded-xl shadow-lg">
            <MapPin className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Add New Address Button */}
      {!showAddForm && !editingAddress && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg border-2 border-red-600 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-3" />
            Add New Address
          </Button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-100 to-white px-8 py-6 border-b-2 border-red-600">
            <div className="flex items-center">
              <div className="bg-red-600 p-3 rounded-xl mr-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-600">Add New Address</h2>
                <p className="text-red-500">Fill in the details for your new address</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <AddressForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingAddress && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-100 to-white px-8 py-6 border-b-2 border-red-600">
            <div className="flex items-center">
              <div className="bg-red-600 p-3 rounded-xl mr-4">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-600">Edit Address</h2>
                <p className="text-red-500">Update your address information</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <AddressForm
              existingAddress={editingAddress}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditingAddress(null)}
            />
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showAddForm && !editingAddress ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-10 text-center">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-12 w-12 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Addresses Found</h1>
            <p className="text-gray-600 mb-8">
              Add an address to make checkout faster and easier.
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-2xl shadow-lg border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {/* Address Header */}
              <div className="bg-gradient-to-r from-red-100 to-white px-8 py-5 border-b-2 border-red-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-600 p-2 rounded-lg mr-3">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-600 text-lg">
                        {address.name}
                      </h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold ml-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="p-8">
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <Home className="h-4 w-4 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-red-600 font-bold">
                        {address.street}
                      </p>
                      <p className="text-red-500">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-red-500">{address.country}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-red-600 mr-3" />
                    <p className="text-red-600 font-bold">{address.phone}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  {!address.isDefault && (
                    <Button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Set as Default
                    </Button>
                  )}

                  <Button
                    onClick={() => setEditingAddress(address)}
                    variant="outline"
                    className="border-2 border-red-600 text-red-600 hover:bg-red-100 hover:border-red-500 px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={deletingId === address.id}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm border-2 border-red-600"
                  >
                    {deletingId === address.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
