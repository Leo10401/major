'use client';
import useAppContext from '@/context/AppContext';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
  const { email } = useAppContext();
  const [previewUrl, setPreviewUrl] = useState('');
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/getbyemail/${email}`);
      setUserData(res.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data.');
    }
  };

  const uploadAvatar = async (e, setFieldValue) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'myuploadpreset');
    formData.append('cloud_name', 'de4osq89e');

    try {
      const result = await axios.post('https://api.cloudinary.com/v1_1/de4osq89e/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File Uploaded Successfully');
      setPreviewUrl(result.data.url);
      setFieldValue('avatar', result.data.url);
    } catch (error) {
      console.error('File Upload Error:', error);
      toast.error('File Upload Failed');
    }
  };

  const updateUser = async (values) => {
    try {
      await axios.put(`http://localhost:5000/user/update/${userData._id}`, values);
      toast.success('Your data was updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return userData ? (
    <Formik
      initialValues={userData}
      onSubmit={updateUser}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-center">Update Profile</h1>
          <Form>
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Avatar</label>
              <label className="block cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="max-w-full h-40 object-cover rounded-lg" />
                ) : (
                  <img src={userData.avatar} className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg">
                    
                  </img>
                )}
                <input
                  type="file"
                  onChange={(e) => uploadAvatar(e, setFieldValue)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Name</label>
              <Field
                name="name"
                type="text"
                className="py-3 px-4 block w-full border rounded-lg text-sm"
              />
            </div>

            

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Description</label>
              <Field
                name="description"
                as="textarea"
                rows={4}
                className="py-3 px-4 block w-full border rounded-lg text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button type="submit" className="py-3 px-6 bg-blue-600 text-white rounded-lg">
                Update Profile
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
    </div>
  );
};

export default UpdateProfile;
