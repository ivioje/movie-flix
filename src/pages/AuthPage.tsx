
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("sign-in");
  const navigate = useNavigate();

  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <div className="mx-auto max-w-md w-full">
        <Card className="border-none shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Welcome to MovieFlix
            </CardTitle>
            <CardDescription className="text-center">
              Your personal movie companion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "mx-auto w-full",
                      card: "shadow-none p-0",
                      header: "hidden",
                      footer: "hidden",
                    },
                  }}
                  redirectUrl="/dashboard"
                />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: "mx-auto w-full",
                      card: "shadow-none p-0",
                      header: "hidden",
                      footer: "hidden",
                    },
                  }}
                  redirectUrl="/dashboard"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link to="#" className="underline hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
