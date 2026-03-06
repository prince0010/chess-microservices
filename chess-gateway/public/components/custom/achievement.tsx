"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Award } from "lucide-react";
import { ICoach } from "@/modules/coach/interface";
import { useUpdateCoach } from "@/modules/coach/hooks";
import { toast } from "sonner";

interface CoachAchievementsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    coach: ICoach | null;
    onSuccess?: () => void;
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export default function CoachAchievementsDialog({
    isOpen,
    onClose,
    coach,
    onSuccess
}: CoachAchievementsDialogProps) {
    const [achievements, setAchievements] = useState<string[]>([]);
    const [newAchievement, setNewAchievement] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [updateCoach] = useUpdateCoach();

    // Update achievements when coach changes or dialog opens
    useEffect(() => {
        if (coach) {
            console.log("Loading achievements for coach:", coach.achievements);
            setAchievements(coach.achievements || []);
        }
    }, [coach]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setNewAchievement("");
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleAddAchievement = () => {
        if (newAchievement.trim()) {
            setAchievements([...achievements, newAchievement.trim()]);
            setNewAchievement("");
        }
    };

    const handleRemoveAchievement = (index: number) => {
        setAchievements(achievements.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddAchievement();
        }
    };

    const handleSubmit = async () => {
        if (!coach) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Updating achievements...");

        try {
            console.log("Submitting achievements:", achievements);

            await updateCoach({
                variables: {
                    input: {
                        _id: coach._id.toString(),
                        achievements
                    }
                }
            });

            toast.success("Achievements updated successfully", { id: toastId });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Error updating achievements:", error);
            toast.error(error.message || "Failed to update achievements", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        Manage Achievements
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Add or remove achievements for <span className="underline underline-offset-2 text-black">{coach?.firstName} {coach?.lastName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm">Achievements</Label>
                        <div className="flex flex-wrap gap-2 min-h-[100px] max-h-[200px] overflow-y-auto p-3 border rounded-lg bg-gray-50">
                            {achievements.length > 0 ? (
                                achievements.map((achievement, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 max-w-full group relative text-sm"
                                        title={achievement}
                                    >
                                        <span className="truncate max-w-[150px] md:max-w-[180px] lg:max-w-[200px] text-xs">
                                            {truncateText(achievement, 25)}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveAchievement(index)}
                                            className="ml-1 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground w-full text-center py-4">
                                    No achievements added yet
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {achievements.length} {achievements.length === 1 ? 'achievement' : 'achievements'} • Hover over badges to see full text
                        </p>
                    </div>

                    {/* Add New Achievement */}
                    <div className="space-y-2">
                        <Label htmlFor="new-achievement" className="text-sm">
                            Add New Achievement
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="new-achievement"
                                value={newAchievement}
                                onChange={(e) => setNewAchievement(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g., 5-time National Champion"
                                className="flex-1 text-sm"
                            />
                            <Button
                                type="button"
                                onClick={handleAddAchievement}
                                disabled={!newAchievement.trim()}
                                className="cursor-pointer text-sm"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Press Enter to quickly add achievements
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Suggestions:</Label>
                        <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto p-1">
                            {[
                                "Regional Chess Champion 2023",
                                "National Master Title",
                                "International Tournament Winner",
                                "Best Coach Award 2024",
                                "15+ Years Coaching Experience",
                                "FIDE Master (FM) Title",
                                "Youth Chess Development Award",
                                "Chess Olympiad Participant"
                            ].map((example) => (
                                <Badge
                                    key={example}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-accent max-w-full"
                                    onClick={() => {
                                        if (!achievements.includes(example)) {
                                            setAchievements([...achievements, example]);
                                        }
                                    }}
                                    title={example}
                                >
                                    <Plus className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate max-w-[120px] text-xs">
                                        {truncateText(example, 20)}
                                    </span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-200 text-sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-sm"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}