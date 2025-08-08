import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignupSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignupSuccessDialog = ({ open, onOpenChange }: SignupSuccessDialogProps) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    onOpenChange(false);
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold text-primary">
              Great Work!
            </h2>
            <p className="text-xl text-foreground">
              Endless adventures await!
            </p>
          </div>
          
          <Button 
            onClick={handleExploreClick}
            className="w-full text-lg py-6 animate-pulse hover:animate-none transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-600 hover:to-purple-700"
            size="lg"
          >
            Explore Adventures
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupSuccessDialog;