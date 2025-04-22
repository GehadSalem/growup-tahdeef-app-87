
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { BookText, Heart, MessageSquare, Plus, ThumbsUp, Users } from "lucide-react";

// Sample community groups
const COMMUNITY_GROUPS = [
  { 
    id: "1", 
    name: "تطوير الذات المستمر", 
    members: 250, 
    category: "تطوير", 
    icon: <BookText className="h-5 w-5" />,
    description: "مجموعة لمناقشة أساليب وتقنيات تطوير الذات والنمو الشخصي" 
  },
  { 
    id: "2", 
    name: "المستثمرون الذكيون", 
    members: 180, 
    category: "مالي",
    icon: <Users className="h-5 w-5" />,
    description: "مجموعة لمشاركة نصائح الاستثمار واستراتيجيات بناء الثروة" 
  },
  { 
    id: "3", 
    name: "تحدي العادات الصحية", 
    members: 320, 
    category: "صحة",
    icon: <Heart className="h-5 w-5" />,
    description: "مجموعة تدعم تبني عادات صحية يومية والحفاظ عليها" 
  }
];

// Sample community posts
const COMMUNITY_POSTS = [
  {
    id: "1",
    userName: "أحمد محمد",
    userInitials: "أ م",
    userAvatar: "",
    postTime: "منذ 3 ساعات",
    content: "أكملت اليوم تحدي القراءة! 30 كتاب في 90 يوم. فخور جداً بهذا الإنجاز! 📚 من منكم يقرأ بانتظام؟",
    likes: 42,
    comments: 15,
    group: "تطوير الذات المستمر"
  },
  {
    id: "2",
    userName: "سارة علي",
    userInitials: "س ع",
    userAvatar: "",
    postTime: "منذ يوم",
    content: "بدأت اليوم باستثمار أول 500 ريال في منصة أصيل! خطوة صغيرة لكنها بداية لرحلة الاستقلال المالي. هل أحد جرب المنصة من قبل؟",
    likes: 28,
    comments: 24,
    group: "المستثمرون الذكيون"
  },
  {
    id: "3",
    userName: "محمد خالد",
    userInitials: "م خ",
    userAvatar: "",
    postTime: "منذ يومين",
    content: "أكملت اليوم الأسبوع الثالث من تحدي 'صفر سكريات'! شعور رائع والطاقة أصبحت أفضل بكثير 💪",
    likes: 56,
    comments: 18,
    group: "تحدي العادات الصحية"
  }
];

// Sample challenges
const CHALLENGES = [
  {
    id: "1",
    title: "تحدي القراءة اليومي",
    participants: 87,
    duration: "30 يوم",
    description: "قراءة 10 صفحات يومياً على الأقل"
  },
  {
    id: "2",
    title: "تحدي التوفير",
    participants: 63,
    duration: "60 يوم",
    description: "ادخار 10% من الدخل اليومي"
  }
];

export default function Community() {
  const { toast } = useToast();
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [activeTab, setActiveTab] = useState("feed");
  
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  const likePost = (id: string) => {
    const isLiked = likedPosts.includes(id);
    
    if (isLiked) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
    
    setPosts(posts.map(post =>
      post.id === id ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };
  
  const joinChallenge = () => {
    toast({
      title: "تم الانضمام",
      description: "تم انضمامك للتحدي بنجاح! لنبدأ رحلة النجاح معاً!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="المجتمع" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-cairo text-lg ${
              activeTab === "feed" 
                ? "text-growup border-b-2 border-growup" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("feed")}
          >
            المنشورات
          </button>
          <button
            className={`px-4 py-2 font-cairo text-lg ${
              activeTab === "groups" 
                ? "text-growup border-b-2 border-growup" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            المجموعات
          </button>
          <button
            className={`px-4 py-2 font-cairo text-lg ${
              activeTab === "challenges" 
                ? "text-growup border-b-2 border-growup" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("challenges")}
          >
            التحديات
          </button>
        </div>
        
        {/* Feed Tab */}
        {activeTab === "feed" && (
          <>
            {/* Create Post */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button className="bg-growup hover:bg-growup-dark">
                    <Plus className="mr-0 ml-2 h-4 w-4" />
                    إنشاء منشور
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback className="bg-growup/20 text-growup font-cairo">
                        أ ن
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-cairo">شارك إنجازك...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Posts */}
            <div className="space-y-6">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-start gap-2">
                      <Avatar>
                        <AvatarFallback className="font-cairo bg-growup/20 text-growup">
                          {post.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base font-cairo">{post.userName}</CardTitle>
                          <span className="text-xs text-gray-500 font-cairo">
                            {post.postTime}
                          </span>
                        </div>
                        <CardDescription className="font-cairo text-xs">
                          في مجموعة {post.group}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-right">
                    <p className="font-cairo">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1 text-sm ${likedPosts.includes(post.id) ? 'text-rose-500' : 'text-gray-500'}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-cairo">{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-sm text-gray-500">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-cairo">{post.comments}</span>
                      </button>
                    </div>
                    
                    <button className="text-sm text-growup font-cairo">
                      شارك
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
        
        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button className="bg-growup hover:bg-growup-dark">
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إنشاء مجموعة
              </Button>
              
              <h2 className="text-xl font-bold font-cairo">مجموعات المجتمع</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMUNITY_GROUPS.map(group => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-growup/10 text-growup">
                        {group.category}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {group.icon}
                        <CardTitle className="text-lg font-cairo">{group.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-right font-cairo">
                      {group.members} عضو
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-right">
                    <p className="font-cairo text-gray-600">{group.description}</p>
                  </CardContent>
                  
                  <CardFooter className="justify-end">
                    <Button variant="outline" className="w-full">
                      انضم للمجموعة
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button className="bg-growup hover:bg-growup-dark">
                <Plus className="mr-0 ml-2 h-4 w-4" />
                إنشاء تحدي
              </Button>
              
              <h2 className="text-xl font-bold font-cairo">تحديات الجروب</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHALLENGES.map(challenge => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-growup/10 text-growup">
                        {challenge.duration}
                      </span>
                      
                      <CardTitle className="text-lg font-cairo">{challenge.title}</CardTitle>
                    </div>
                    <CardDescription className="text-right font-cairo">
                      {challenge.participants} مشارك
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-right">
                    <p className="font-cairo text-gray-600">{challenge.description}</p>
                  </CardContent>
                  
                  <CardFooter className="justify-end">
                    <Button 
                      className="w-full bg-growup hover:bg-growup-dark"
                      onClick={joinChallenge}
                    >
                      شارك في التحدي
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
