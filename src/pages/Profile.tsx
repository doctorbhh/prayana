import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { auth, db, onAuthStateChangedListener } from '../config/firebase'; // Adjust path as needed
import { ref, onValue, off } from 'firebase/database';
import { sendPasswordResetEmail } from 'firebase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes using onAuthStateChangedListener
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      if (currentUser) {
        // User is signed in, fetch their data
        const userRef = ref(db, `users/${currentUser.uid}`);
        onValue(
          userRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setUserData(data);
            } else {
              setError('User data not found.');
            }
            setLoading(false);
          },
          (err) => {
            setError('Failed to fetch user data.');
            setLoading(false);
            console.error('Database error:', err);
          }
        );
      } else {
        // No user is signed in, redirect to login
        setError('Please sign in to view your profile.');
        setLoading(false);
        navigate('/login');
      }
    });

    // Cleanup listeners on component unmount
    return () => {
      unsubscribe();
      if (auth.currentUser) {
        off(ref(db, `users/${auth.currentUser.uid}`));
      }
    };
  }, [navigate]);

  const handleResetPassword = async () => {
    if (!userData?.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No email address found for this user.',
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, userData.email);
      toast({
        title: 'Password Reset',
        description: 'A password reset link has been sent to your email.',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: 'An error occurred while sending the reset email. Please try again.',
      });
    }
  };

  const handleAddPayment = () => {
    // Placeholder for future payment integration
    toast({
      title: 'Add Payment',
      description: 'Payment integration is coming soon!',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>

      {/* Profile Card */}
      <Card className="max-w-lg mx-auto shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-ebike-softBlue shadow-sm">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`}
              alt={userData.name}
            />
            <AvatarFallback className="text-lg font-medium">
              {getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-gray-800">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* User Information */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium text-gray-600">Username</Label>
              <Input
                value={userData.name || ''}
                readOnly
                className="bg-gray-50 text-gray-800 border-gray-300 rounded-md focus:ring-ebike-softBlue focus:border-ebike-softBlue transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <Input
                value={userData.email || ''}
                readOnly
                className="bg-gray-50 text-gray-800 border-gray-300 rounded-md focus:ring-ebike-softBlue focus:border-ebike-softBlue transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium text-gray-600">Balance</Label>
              <Input
                value={`$${userData.balance?.toFixed(2) || '0.00'}`}
                readOnly
                className="bg-gray-50 text-gray-800 border-gray-300 rounded-md focus:ring-ebike-softBlue focus:border-ebike-softBlue transition-colors duration-200"
              />
            </div>
          </div>

          {/* Reset Password Button */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-ebike-softBlue text-ebike-dark hover:bg-ebike-softBlue hover:text-white transition-all duration-300 rounded-md font-medium"
            onClick={handleResetPassword}
          >
            <Lock className="h-5 w-5" />
            Reset Password
          </Button>

          {/* Add Payment Button */}
          <Button
            className="w-full flex items-center gap-2 bg-ebike-dark hover:bg-ebike-dark/90 text-white transition-all duration-300 rounded-md font-medium"
            onClick={handleAddPayment}
          >
            <CreditCard className="h-5 w-5" />
            Add Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;