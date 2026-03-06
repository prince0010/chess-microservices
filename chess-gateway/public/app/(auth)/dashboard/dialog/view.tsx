"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ICoach, CoachStatus, ChessTitle } from "@/modules/coach/interface";
import {
    Mail, Phone, FileCheck, Calendar,
    Clock, CheckCircle, XCircle,
    Award, User, Trophy, Star, Medal, Crown, Zap, Target, Users, Flag,
    Globe
} from "lucide-react";
import { Label } from "@/components/ui/label";

// Chess Title labels
const CHESS_TITLE_LABELS: Record<ChessTitle, string> = {
    [ChessTitle.NONE]: "None",
    [ChessTitle.WORLD_CHAMPION]: "World Champion",
    [ChessTitle.GRANDMASTER]: "Grandmaster (GM)",
    [ChessTitle.WOMAN_GRANDMASTER]: "Woman Grandmaster (WGM)",
    [ChessTitle.INTERNATIONAL_MASTER]: "International Master (IM)",
    [ChessTitle.WOMAN_INTERNATIONAL_MASTER]: "Woman International Master (WIM)",
    [ChessTitle.FIDE_MASTER]: "FIDE Master (FM)",
    [ChessTitle.WOMAN_FIDE_MASTER]: "Woman FIDE Master (WFM)",
    [ChessTitle.CANDIDATE_MASTER]: "Candidate Master (CM)",
    [ChessTitle.WOMAN_CANDIDATE_MASTER]: "Woman Candidate Master (WCM)",
    [ChessTitle.ARENA_GRANDMASTER]: "Arena Grandmaster (AGM)",
    [ChessTitle.WOMAN_ARENA_GRANDMASTER]: "Woman Arena Grandmaster (WAGM)",
    [ChessTitle.ARENA_INTERNATIONAL_MASTER]: "Arena International Master (AIM)",
    [ChessTitle.WOMAN_ARENA_INTERNATIONAL_MASTER]: "Woman Arena International Master (WAIM)",
    [ChessTitle.ARENA_FIDE_MASTER]: "Arena FIDE Master (AFM)",
    [ChessTitle.WOMAN_ARENA_FIDE_MASTER]: "Woman Arena FIDE Master (WAFM)",
};

// Helper function to get icon based on achievement text
const getAchievementIcon = (achievement: string) => {
    const lower = achievement.toLowerCase();
    if (lower.includes('champion') || lower.includes('winner')) return Trophy;
    if (lower.includes('grandmaster') || lower.includes('gm')) return Crown;
    if (lower.includes('master')) return Medal;
    if (lower.includes('fide')) return Star;
    if (lower.includes('international')) return Flag;
    if (lower.includes('experience') || lower.includes('years')) return Clock;
    if (lower.includes('student') || lower.includes('taught')) return Users;
    if (lower.includes('tournament')) return Target;
    if (lower.includes('rapid') || lower.includes('blitz')) return Zap;
    return Award;
};

// Get color based on achievement type
const getAchievementColor = (achievement: string) => {
    const lower = achievement.toLowerCase();
    if (lower.includes('champion') || lower.includes('winner')) return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
    if (lower.includes('grandmaster') || lower.includes('gm')) return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
    if (lower.includes('master')) return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
    if (lower.includes('fide')) return "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200";
    if (lower.includes('international')) return "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200";
    if (lower.includes('experience') || lower.includes('years')) return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
    if (lower.includes('student') || lower.includes('taught')) return "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200";
    if (lower.includes('tournament')) return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
    if (lower.includes('rapid') || lower.includes('blitz')) return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200";
    return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
};

interface CoachViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    coach: ICoach | null;
}

export default function CoachViewDialog({
    isOpen,
    onClose,
    coach,
}: CoachViewDialogProps) {
    if (!coach) return null;

    const getStatusBadge = (status: CoachStatus) => {
        switch (status) {
            case CoachStatus.PENDING:
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>;
            case CoachStatus.VERIFIED:
                return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
            case CoachStatus.REJECTED:
                return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Coach Details
                        {getStatusBadge(coach.status)}
                    </DialogTitle>
                    <DialogDescription>
                        Complete information about the coach application.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Profile Header */}
                    <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24 border-2 border-gray-200">
                            {coach.photo ? (
                                <AvatarImage src={coach.photo} alt={`${coach.firstName} ${coach.lastName}`} />
                            ) : (
                                <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">
                                    {coach.firstName.charAt(0)}{coach.lastName.charAt(0)}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">
                                {coach.firstName} {coach.lastName}
                            </h2>
                            {coach.chessTitle && coach.chessTitle !== ChessTitle.NONE && (
                                <Badge className="mt-1 bg-blue-100 text-blue-800">
                                    {CHESS_TITLE_LABELS[coach.chessTitle]}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Achievements Section - WITH COLORS */}
                    {coach?.achievements && coach.achievements.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Award className="w-4 h-4 text-purple-600" />
                                Achievements & Honors
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {coach.achievements.map((achievement, index) => {
                                    const Icon = getAchievementIcon(achievement);
                                    const colorClass = getAchievementColor(achievement);
                                    return (
                                        <Badge
                                            key={index}
                                            className={`${colorClass} flex items-center gap-1 px-3 py-1.5 text-sm font-normal border`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {achievement}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Contact Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span>{coach.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{coach.phoneNumber}</span>
                                </div>
                                {coach.fideId && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Trophy className="w-4 h-4 text-gray-500" />
                                        <span>FIDE ID: {coach.fideId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Professional Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Listed on Website:</span>
                                    <Badge variant={coach.wantsToBeListed ? "default" : "outline"}>
                                        {coach.wantsToBeListed ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Has Students on App:</span>
                                    <Badge variant={coach.hasStudentsOnApp ? "default" : "outline"}>
                                        {coach.hasStudentsOnApp ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <span>{coach.languages.join(", ")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CV Section */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">CV / Resume</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(coach.cvFile, '_blank')}
                                className="bg-white"
                            >
                                View CV
                            </Button>
                        </div>
                    </div>

                    {/* Application Status Timeline - Compact */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                            <h3 className="font-semibold flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                Application Timeline
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                {/* Application Submitted */}
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-sm font-medium">Application Submitted</span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(coach.applicationDate)}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Status */}
                                {coach.reviewedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${coach.status === CoachStatus.VERIFIED
                                            ? 'bg-green-100'
                                            : coach.status === CoachStatus.REJECTED
                                                ? 'bg-red-100'
                                                : 'bg-gray-100'
                                            }`}>
                                            {coach.status === CoachStatus.VERIFIED ? (
                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                            ) : coach.status === CoachStatus.REJECTED ? (
                                                <XCircle className="w-3 h-3 text-red-600" />
                                            ) : (
                                                <Clock className="w-3 h-3 text-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium">
                                                    Application {coach.status === CoachStatus.VERIFIED ? 'Verified' : 'Rejected'}
                                                </span>
                                                {coach.rejectionReason && (
                                                    <span className="text-xs text-red-600 ml-2">
                                                        ({coach.rejectionReason})
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(coach.reviewedAt)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}