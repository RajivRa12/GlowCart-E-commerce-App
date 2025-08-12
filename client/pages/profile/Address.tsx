import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function Address() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      phone: "+91 9876543210",
      addressLine1: "123 Beauty Street",
      addressLine2: "Near Cosmetics Mall",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleAddAddress = () => {
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    });
    setShowAddForm(false);
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/profile" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Address</h1>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Address List */}
      <div className="px-6 py-6 space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-coral-500 mr-2" />
                <span className="font-semibold text-gray-800">{address.name}</span>
                {address.isDefault && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteAddress(address.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-gray-600 space-y-1">
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state} - {address.pincode}</p>
              <p>{address.phone}</p>
            </div>
            
            {!address.isDefault && (
              <Button
                onClick={() => setDefaultAddress(address.id)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Set as Default
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add Address Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Address</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Address Name (Home, Office, etc.)"
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                className="rounded-2xl"
              />
              <Input
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                className="rounded-2xl"
              />
              <Input
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                className="rounded-2xl"
              />
              <Input
                placeholder="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                className="rounded-2xl"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="rounded-2xl"
                />
                <Input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  className="rounded-2xl"
                />
              </div>
              <Input
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                className="rounded-2xl"
              />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAddress}
                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-2xl"
              >
                Save Address
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
