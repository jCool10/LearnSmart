'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle,
  MessageCircle,
  Send,
  Brain,
  Lightbulb,
  Target,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bookmark,
  Share,
  Download,
  Menu,
  X,
  Star,
  Trophy,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const LessonDetailPage: React.FC = () => {
  const { user } = useAuth()
  const params = useParams()
  const pathId = params.pathId as string
  const lessonId = params.lessonId as string

    const lessonData = {
      id: lessonId,
      pathId: pathId,
      title: "Event Handling in JavaScript",
      description: "Học cách xử lý events và user interactions trong JavaScript",
      duration: 85,
      objectives: [
        "Hiểu được Event Model trong JavaScript",
        "Học cách add/remove event listeners",
        "Xử lý các loại events phổ biến (click, input, submit)",
        "Hiểu về Event Bubbling và Capturing",
        "Thực hành với các ví dụ thực tế",
      ],
      content: `
# Event Handling in JavaScript

Event handling là một phần quan trọng trong JavaScript, cho phép chúng ta tương tác với người dùng và phản hồi lại các hành động của họ.

## 1. Event Model

JavaScript Event Model định nghĩa cách các events được tạo ra và xử lý trong DOM.

### Các loại Events phổ biến:
- **Mouse Events**: click, dblclick, mousedown, mouseup, mouseover, mouseout
- **Keyboard Events**: keydown, keyup, keypress
- **Form Events**: submit, change, input, focus, blur
- **Window Events**: load, resize, scroll

## 2. Event Listeners

### Adding Event Listeners
\`\`\`javascript
// Method 1: addEventListener (Recommended)
element.addEventListener('click', function(event) {
    console.log('Button clicked!');
});

// Method 2: Inline event handler
element.onclick = function(event) {
    console.log('Button clicked!');
};

// Method 3: HTML attribute (Not recommended)
// <button onclick="handleClick()">Click me</button>
\`\`\`

### Removing Event Listeners
\`\`\`javascript
function handleClick(event) {
    console.log('Button clicked!');
}

// Add listener
element.addEventListener('click', handleClick);

// Remove listener
element.removeEventListener('click', handleClick);
\`\`\`

## 3. Event Object

Khi một event xảy ra, JavaScript tạo ra một Event object chứa thông tin về event đó.

\`\`\`javascript
button.addEventListener('click', function(event) {
    console.log('Event type:', event.type);
    console.log('Target element:', event.target);
    console.log('Current target:', event.currentTarget);
    console.log('Mouse coordinates:', event.clientX, event.clientY);
    
    // Prevent default behavior
    event.preventDefault();
    
    // Stop event propagation
    event.stopPropagation();
});
\`\`\`

## 4. Event Bubbling và Capturing

### Event Bubbling
Event bubbling là quá trình event "nổi" từ element con lên element cha.

\`\`\`javascript
// HTML: <div id="parent"><button id="child">Click me</button></div>

document.getElementById('parent').addEventListener('click', function() {
    console.log('Parent clicked');
});

document.getElementById('child').addEventListener('click', function(event) {
    console.log('Child clicked');
    // event.stopPropagation(); // Uncomment to stop bubbling
});
\`\`\`

### Event Capturing
Event capturing là quá trình ngược lại - từ element cha xuống element con.

\`\`\`javascript
element.addEventListener('click', handler, true); // true enables capturing
\`\`\`

## 5. Practical Examples

### Form Validation
\`\`\`javascript
const form = document.getElementById('myForm');
const input = document.getElementById('email');

form.addEventListener('submit', function(event) {
    const email = input.value;
    
    if (!email.includes('@')) {
        event.preventDefault(); // Stop form submission
        alert('Please enter a valid email');
    }
});

input.addEventListener('input', function(event) {
    const value = event.target.value;
    if (value.includes('@')) {
        input.style.borderColor = 'green';
    } else {
        input.style.borderColor = 'red';
    }
});
\`\`\`

### Dynamic Content
\`\`\`javascript
const button = document.getElementById('addItem');
const list = document.getElementById('itemList');

button.addEventListener('click', function() {
    const newItem = document.createElement('li');
    newItem.textContent = 'New item';
    
    // Add click handler to new item
    newItem.addEventListener('click', function() {
        this.style.textDecoration = 'line-through';
    });
    
    list.appendChild(newItem);
});
\`\`\`

## 6. Best Practices

1. **Use addEventListener()** thay vì inline handlers
2. **Remove unused event listeners** để tránh memory leaks
3. **Use event delegation** cho dynamic content
4. **Handle errors** trong event handlers
5. **Be careful with \`this\` context** trong arrow functions

## 7. Exercise

Hãy thử tạo một simple calculator với event handling:

\`\`\`html
<div id="calculator">
    <input type="text" id="display" readonly>
    <div class="buttons">
        <button data-number="1">1</button>
        <button data-number="2">2</button>
        <button data-operator="+">+</button>
        <button data-action="calculate">=</button>
        <button data-action="clear">C</button>
    </div>
</div>
\`\`\`

Sử dụng event delegation để xử lý tất cả button clicks!
    `,
      hints: [
        "Event handlers có thể được add bằng addEventListener() method",
        "Event object chứa nhiều thông tin hữu ích về event",
        "preventDefault() có thể ngăn chặn hành vi mặc định của element",
        "Event bubbling cho phép parent elements nhận events từ children",
        "Always remove event listeners khi không cần thiết để tránh memory leaks",
      ],
      resources: [
        {
          title: "MDN Event Handling Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
          type: "documentation",
        },
        {
          title: "JavaScript Event Handling Tutorial",
          url: "https://javascript.info/introduction-browser-events",
          type: "tutorial",
        },
      ],
    }
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Xin chào ${user?.username || 'bạn'}! Tôi là AI Tutor cho bài học này. Tôi sẽ hỗ trợ bạn trong suốt quá trình học về **${lessonData.title}**.\n\nHãy hỏi tôi bất kỳ điều gì bạn không hiểu, tôi sẽ giải thích một cách chi tiết và dễ hiểu nhất!`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [studyTime, setStudyTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showHints, setShowHints] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Mock lesson data


  // Study timer effect
  useEffect(() => {
    if (!isPaused) {
      studyTimerRef.current = setInterval(() => {
        setStudyTime(prev => prev + 1)
      }, 1000)
    } else {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current)
      }
    }

    return () => {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current)
      }
    }
  }, [isPaused])

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Đây là câu trả lời từ AI Tutor về "${inputMessage}". Trong thực tế, đây sẽ là phản hồi thông minh từ AI dựa trên context của bài học về Event Handling.\n\nTôi có thể giải thích chi tiết hơn về bất kỳ khái niệm nào bạn muốn tìm hiểu!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleCompleteLesson = () => {
    setIsCompleted(true)
    if (studyTimerRef.current) {
      clearInterval(studyTimerRef.current)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href={`/roadmap/${pathId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lessonData.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {lessonData.description}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {formatTime(studyTime)}
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
              </Button>
              
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                {/* Lesson Info */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{lessonData.duration} phút</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Target className="w-4 h-4" />
                        <span>{lessonData.objectives.length} mục tiêu</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Gợi ý
                    </Button>
                  </div>

                  {/* Learning Objectives */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Mục tiêu học tập:
                    </h3>
                    <ul className="space-y-2">
                      {lessonData.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hints Panel */}
                  {showHints && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Gợi ý học tập
                      </h4>
                      <ul className="space-y-2">
                        {lessonData.hints.map((hint, index) => (
                          <li key={index} className="text-sm text-blue-800 dark:text-blue-200">
                            • {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="p-6">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">
                      {lessonData.content}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Thời gian học: {formatTime(studyTime)}</span>
                      <span>•</span>
                      <span>Tiến độ: Đang học</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {!isCompleted ? (
                        <Button onClick={handleCompleteLesson}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Hoàn thành bài học
                        </Button>
                      ) : (
                        <Link href={`/roadmap/${pathId}/lesson/${lessonId}/assessment`}>
                          <Button>
                            <Trophy className="w-4 h-4 mr-2" />
                            Làm bài kiểm tra
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-300">
                            Chúc mừng! Bạn đã hoàn thành bài học này.
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            Hãy làm bài kiểm tra để mở khóa bài học tiếp theo.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Tutor Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-8">
                {/* Chat Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI Tutor</h3>
                      <p className="text-xs text-green-600 dark:text-green-400">Sẵn sàng hỗ trợ</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' 
                            ? 'text-blue-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Hỏi AI về bài học này..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button 
                      onClick={() => setInputMessage('Giải thích về Event Bubbling?')}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Event Bubbling?
                    </button>
                    <button 
                      onClick={() => setInputMessage('Cho ví dụ về addEventListener?')}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Ví dụ addEventListener?
                    </button>
                    <button 
                      onClick={() => setInputMessage('preventDefault() dùng khi nào?')}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      preventDefault()?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default LessonDetailPage