'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Fullscreen as ExpandIcon,
  FullscreenExit as CollapseIcon,
  Email as EmailIcon,
  ContactMail as ContactIcon,
  Work as ProjectIcon,
  Person as ExperienceIcon,
  School as EducationIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewMessage: () => void;
  chatbotStatus?: {
    status: 'online' | 'offline' | 'checking';
    message: string;
    lastChecked: Date | null;
    error?: string;
  };
  onRefreshStatus?: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onNewMessage,
  chatbotStatus,
  onRefreshStatus
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSchedulingForm, setShowSchedulingForm] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [quickQuestionType, setQuickQuestionType] = useState<'initial' | 'post-contact'>('initial');
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [schedulingFormSubmitted, setSchedulingFormSubmitted] = useState(false);
  const [directSchedulingRequest, setDirectSchedulingRequest] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [schedulingFormData, setSchedulingFormData] = useState({
    meetingType: '15min' as '15min' | '30min',
    selectedDate: '',
    selectedTimeSlot: '',
    timezone: 'America/New_York'
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();

  // Custom close handler - just close without thank you message
  const handleClose = () => {
    // Reset initialization flag when closing so it can reinitialize on next open
    isInitializedRef.current = false;
    onClose();
  };

  // Parse inline formatting like **bold text** and links
  const parseInlineFormatting = (text: string) => {
    // First split by URLs (both absolute and relative)
    const urlRegex = /(https?:\/\/[^\s]+|\/[^\s]*\.pdf)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      // If it's a URL, make it clickable
      if (part.match(urlRegex)) {
        const isRelativeUrl = part.startsWith('/');
        const displayText = isRelativeUrl && part.includes('.pdf') ? 'View Resume' : part;

        return (
          <Box
            key={index}
            component="a"
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              fontWeight: 500,
              '&:hover': {
                color: theme.palette.primary.dark,
                textDecoration: 'underline'
              }
            }}
          >
            {displayText}
          </Box>
        );
      }

      // Then handle bold formatting within non-URL parts
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((boldPart, boldIndex) => {
        if (boldPart.match(/^\*\*.*\*\*$/)) {
          const boldText = boldPart.replace(/\*\*/g, '');
          return (
            <Box key={`${index}-${boldIndex}`} component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              {boldText}
            </Box>
          );
        }
        return boldPart;
      });
    });
  };

  // Format message to handle markdown-style formatting
  const formatMessage = (text: string) => {
    const lines = text.split('\n');
    const formattedElements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle different line types
      if (trimmedLine.match(/^\*\*.*\*\*.*$/)) {
        // Bold headers with emojis
        const cleanText = trimmedLine.replace(/\*\*/g, '');
        formattedElements.push(
          <Typography
            key={`header-${index}`}
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              mt: index > 0 ? 2 : 0,
              color: theme.palette.primary.main,
              fontSize: '1rem'
            }}
          >
            {cleanText}
          </Typography>
        );
      } else if (trimmedLine.startsWith('• ')) {
        // Bullet points with better spacing and inline formatting including links
        const bulletText = trimmedLine.substring(2);
        const formattedBulletText = parseInlineFormatting(bulletText);
        formattedElements.push(
          <Box key={`bullet-${index}`} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, ml: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mr: 1,
                color: theme.palette.primary.main,
                fontWeight: 600,
                minWidth: '10px'
              }}
            >
              •
            </Typography>
            <Box sx={{ flex: 1, lineHeight: 1.5, fontSize: '0.875rem' }}>
              {formattedBulletText}
            </Box>
          </Box>
        );
      } else if (trimmedLine === '') {
        // Empty lines for spacing
        formattedElements.push(<Box key={`space-${index}`} sx={{ height: 12 }} />);
      } else if (trimmedLine.length > 0) {
        // Regular text with inline bold formatting and links
        const formattedText = parseInlineFormatting(trimmedLine);
        formattedElements.push(
          <Box
            key={`text-${index}`}
            sx={{
              mb: 1,
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              fontSize: '0.875rem'
            }}
          >
            {formattedText}
          </Box>
        );
      }
    });

    return <Box>{formattedElements}</Box>;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Add to conversation history
    setConversationHistory(prev => [...prev, { role: 'assistant', content: text }]);

    // Check if AI mentioned contact form but form isn't showing (fallback trigger)
    const mentionsContactForm = text.toLowerCase().includes('contact form') ||
                               text.toLowerCase().includes('fill out') ||
                               (text.toLowerCase().includes('contact') && text.toLowerCase().includes('below'));

    if (mentionsContactForm && !showContactForm && !contactFormSubmitted) {
      setTimeout(() => {
        setShowContactForm(true);
        setIsExpanded(true);
      }, 500);
    }

    // Check if AI mentioned scheduling but form isn't showing (fallback trigger)
    const mentionsScheduling = text.toLowerCase().includes('schedule') ||
                              text.toLowerCase().includes('calendar') ||
                              text.toLowerCase().includes('meeting') ||
                              text.toLowerCase().includes('call');

    if (mentionsScheduling && !showSchedulingForm && !schedulingFormSubmitted && contactFormSubmitted) {
      setTimeout(() => {
        setShowSchedulingForm(true);
        setIsExpanded(true);
      }, 500);
    }

    // Auto-expand for long responses
    const wordCount = text.split(' ').length;
    const lineCount = text.split('\n').length;
    const hasLinks = text.includes('http');
    const hasBulletPoints = text.includes('•');

    // Expand if response is long or has structured content
    if (wordCount > 80 || lineCount > 8 || (hasLinks && hasBulletPoints)) {
      setIsExpanded(true);
    }

    // Focus input field after bot response (with small delay for better UX)
    setTimeout(() => {
      if (inputRef.current && !showContactForm && !showSchedulingForm) {
        inputRef.current.focus();
      }
    }, 300);

    onNewMessage();
  }, [onNewMessage, showContactForm, contactFormSubmitted]);

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Add to conversation history
    setConversationHistory(prev => [...prev, { role: 'user', content: text }]);
  };

  const initializeChat = useCallback(() => {
    // Add multiple flags to prevent duplicate initialization
    if (messages.length > 0 || isInitializedRef.current) return;

    isInitializedRef.current = true;
    setTimeout(() => {
      addBotMessage("Hi! I'm Amogh's AI assistant. I can answer questions about his experience, projects, skills, and career. What would you like to know?");
      setShowQuickQuestions(true);
    }, 500);
  }, [addBotMessage, messages.length]);

  // Clear chat on page refresh and setup session persistence for chat close/reopen only
  useEffect(() => {
    // Clear any existing chat data on page refresh
    sessionStorage.removeItem('chatMessages');
    sessionStorage.removeItem('chatConversationHistory');

    // Set a flag to track that this is a fresh page load
    sessionStorage.setItem('chatPageRefresh', 'true');
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Check if this is a page refresh or chat reopen
      const isPageRefresh = sessionStorage.getItem('chatPageRefresh') === 'true';

      if (!isPageRefresh) {
        // Try to load previous chat session
        const savedMessages = sessionStorage.getItem('chatMessages');
        const savedConversationHistory = sessionStorage.getItem('chatConversationHistory');

        if (savedMessages) {
          try {
            const parsedMessages = JSON.parse(savedMessages);
            const parsedHistory = savedConversationHistory ? JSON.parse(savedConversationHistory) : [];
            setMessages(parsedMessages);
            setConversationHistory(parsedHistory);

            // Show quick questions if we only have the initial greeting message
            if (parsedMessages.length === 1 && parsedMessages[0].isBot) {
              setShowQuickQuestions(true);
            }
            return; // Don't initialize new chat if we loaded existing one
          } catch (error) {
            console.error('Error loading chat history:', error);
            sessionStorage.removeItem('chatMessages');
            sessionStorage.removeItem('chatConversationHistory');
          }
        }
      }

      // Clear the page refresh flag and start new chat
      sessionStorage.removeItem('chatPageRefresh');
      initializeChat();
    }
  }, [isOpen, initializeChat]); // Removed messages.length from dependency to prevent re-runs

  // Save chat to sessionStorage for chat close/reopen only (not across page refreshes)
  useEffect(() => {
    if (messages.length > 0 && sessionStorage.getItem('chatPageRefresh') !== 'true') {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (conversationHistory.length > 0 && sessionStorage.getItem('chatPageRefresh') !== 'true') {
      sessionStorage.setItem('chatConversationHistory', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  const sendMessageToAI = async (userMessage: string) => {
    try {
      setIsTyping(true);

      // Check if chatbot is offline before making the request
      if (chatbotStatus?.status === 'offline') {
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage('I\'m currently offline and unable to respond. Please try again later or contact Amogh directly through his portfolio.');
        }, 800);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(data.response);
      }, 800 + Math.random() * 1200);

    } catch (error: unknown) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);

      // Provide more specific error messages based on the error
      const err = error as { message?: string };
      let errorMessage = 'Sorry, I\'m having trouble connecting right now. ';

      if (err.message?.includes('401')) {
        errorMessage += 'There\'s an authentication issue with the AI service. ';
      } else if (err.message?.includes('429')) {
        errorMessage += 'The AI service is currently busy. Please try again in a moment. ';
      } else if (err.message?.includes('503')) {
        errorMessage += 'The AI service is temporarily unavailable. ';
      }

      errorMessage += 'Please try asking your question again, or feel free to contact Amogh directly through the contact form on his portfolio.';

      addBotMessage(errorMessage);

      // Trigger status refresh if there's an error
      if (onRefreshStatus) {
        setTimeout(() => {
          onRefreshStatus();
        }, 1000);
      }
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isTyping) return;

    const input = currentInput.trim();
    setShowQuickQuestions(false); // Hide quick questions when user types

    // Check if the message is about scheduling/meeting
    const schedulingKeywords = ['schedule', 'meeting', 'call', 'appointment', 'calendar', 'book', 'set up'];
    const meetingTypes = ['call', 'meeting', 'discussion', 'chat', 'talk', 'interview'];

    const hasSchedulingKeyword = schedulingKeywords.some(keyword => input.toLowerCase().includes(keyword));
    const hasMeetingType = meetingTypes.some(type => input.toLowerCase().includes(type));
    const hasSchedulingContext = ['amogh', 'you', 'him', 'his', 'he'].some(pronoun => input.toLowerCase().includes(pronoun));

    const isSchedulingQuery = (hasSchedulingKeyword || hasMeetingType) && (hasSchedulingContext || input.toLowerCase().includes('schedule'));

    // Check if the message is about contacting Amogh (comprehensive detection)
    const contactKeywords = ['contact', 'reach', 'get in touch', 'hire', 'collaborate', 'email', 'phone', 'message', 'write to'];
    const contactPronouns = ['amogh', 'you', 'him', 'his', 'he', 'author', 'owner'];

    const hasContactKeyword = contactKeywords.some(keyword => input.toLowerCase().includes(keyword));
    const hasContactContext = contactPronouns.some(pronoun => input.toLowerCase().includes(pronoun));

    // Trigger contact form if: has contact keyword AND (has context OR is just asking about "contact")
    const isContactQuery = hasContactKeyword && (hasContactContext || input.toLowerCase().includes('contact')) && !isSchedulingQuery;

    if (isSchedulingQuery) {
      // Add user message
      addUserMessage(input);

      // Check if contact form was already submitted and we can proceed to scheduling
      if (contactFormSubmitted && !schedulingFormSubmitted) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("Perfect! Since you've already provided your contact details, let me help you schedule a meeting with Amogh. Please fill out the scheduling form below.");

          setTimeout(() => {
            setShowSchedulingForm(true);
            setIsExpanded(true);
          }, 300);
        }, 1000 + Math.random() * 600);
      } else if (schedulingFormSubmitted) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("You've already scheduled a meeting! Amogh will reach out to confirm the details. Feel free to ask about his experience or projects while you wait.");
        }, 800 + Math.random() * 400);
      } else {
        // Need contact info first - set flag for direct scheduling request
        setDirectSchedulingRequest(true);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("I'd be happy to help you schedule a meeting with Amogh! First, I'll need your contact information. Please fill out the form below.");

          setTimeout(() => {
            setShowContactForm(true);
            setIsExpanded(true);
          }, 300);
        }, 1000 + Math.random() * 600);
      }
    } else if (isContactQuery) {
      // Add user message
      addUserMessage(input);

      // Check if contact form was already submitted
      if (contactFormSubmitted) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("You've already submitted a contact form! Amogh will get back to you soon. In the meantime, feel free to ask about his experience or projects.");
        }, 800 + Math.random() * 400);
      } else {
        // Add bot response with contact form trigger and typing animation
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("I'd be happy to help you get in touch with Amogh! Please fill out the contact form below and I'll make sure he receives your message.");

          setTimeout(() => {
            setShowContactForm(true);
            setIsExpanded(true); // Auto-expand when contact form appears
          }, 300);
        }, 1000 + Math.random() * 600);
      }
    } else {
      addUserMessage(input);
      await sendMessageToAI(input);
    }

    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setCurrentInput('');
    setShowContactForm(false);
    setShowSchedulingForm(false);
    setShowQuickQuestions(false);
    setQuickQuestionType('initial');
    setContactFormSubmitted(false);
    setSchedulingFormSubmitted(false);
    setDirectSchedulingRequest(false);
    setContactFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      message: ''
    });
    setSchedulingFormData({
      meetingType: '15min',
      selectedDate: '',
      selectedTimeSlot: '',
      timezone: 'America/New_York'
    });
    setAvailableSlots([]);
    setSelectedDate('');
    // Reset initialization flag
    isInitializedRef.current = false;
    // Clear sessionStorage when resetting chat
    sessionStorage.removeItem('chatMessages');
    sessionStorage.removeItem('chatConversationHistory');
    // Don't call initializeChat here - let the useEffect handle it
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuickQuestion = async (question: string) => {
    setShowQuickQuestions(false); // Hide quick questions after use

    if (question.toLowerCase().includes('schedule')) {
      // Add user message
      addUserMessage(question);

      // Check if already scheduled
      if (schedulingFormSubmitted) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("You've already scheduled a meeting! Amogh will reach out to confirm the details.");
        }, 800 + Math.random() * 400);
      } else {
        // Show scheduling form (contact info will be handled during submission)
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("Perfect! Let me help you schedule a meeting with Amogh. Please select your preferred date and time below.");

          setTimeout(() => {
            setShowSchedulingForm(true);
            setIsExpanded(true);
          }, 300);
        }, 1000 + Math.random() * 600);
      }
    } else if (question.toLowerCase().includes('contact')) {
      // Add user message
      addUserMessage(question);

      // Check if contact form was already submitted
      if (contactFormSubmitted) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("You've already submitted a contact form! Amogh will get back to you soon. In the meantime, feel free to ask about his experience or projects.");
        }, 800 + Math.random() * 400);
      } else {
        // Add bot response with contact form trigger and typing animation
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("I'd be happy to help you get in touch with Amogh! Please fill out the contact form below and I'll make sure he receives your message.");

          setTimeout(() => {
            setShowContactForm(true);
            setIsExpanded(true); // Auto-expand when contact form appears
          }, 300);
        }, 1000 + Math.random() * 600);
      }
    } else {
      // Handle other quick questions normally
      addUserMessage(question);
      await sendMessageToAI(question);
    }
  };

  // Function to get available time slots for a specific date
  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/calendar?date=${date}`);
      const data = await response.json();

      if (response.ok) {
        setAvailableSlots(data.freeSlots || []);
      } else {
        console.error('Failed to fetch availability:', data.error);
        // Fallback to default slots if API fails
        setAvailableSlots(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Fallback to default slots if API fails
      setAvailableSlots(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Function to handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSchedulingFormData(prev => ({ ...prev, selectedDate: date, selectedTimeSlot: '' }));
    fetchAvailableSlots(date);
  };

  // Function to handle time slot selection
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSchedulingFormData(prev => ({ ...prev, selectedTimeSlot: timeSlot }));
  };

  // Function to generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Function to format time slots for display
  const formatTimeSlot = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const handleSchedulingSubmit = async () => {
    try {
      setIsTyping(true);

      // Store values before clearing form (to use in success messages)
      const meetingType = schedulingFormData.meetingType;
      const selectedDateStr = schedulingFormData.selectedDate;
      const selectedTime = schedulingFormData.selectedTimeSlot;

      // Use contact form data for attendee info
      const attendeeEmail = contactFormData.email;
      const attendeeName = contactFormData.fullName;

      // If no contact data, use placeholder values (this shouldn't happen in normal flow)
      const finalEmail = attendeeEmail || 'no-email@example.com';
      const finalName = attendeeName || 'Unknown User';

      const startDateTime = new Date(`${selectedDateStr}T${selectedTime}:00`);
      const endDateTime = new Date(startDateTime);

      // Add duration based on meeting type
      if (meetingType === '15min') {
        endDateTime.setMinutes(endDateTime.getMinutes() + 15);
      } else {
        endDateTime.setMinutes(endDateTime.getMinutes() + 30);
      }


      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendeeEmail: finalEmail,
          attendeeName: finalName,
          meetingType: meetingType,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          timezone: schedulingFormData.timezone,
          // Include contact form details
          phoneNumber: contactFormData.phoneNumber,
          contactMessage: contactFormData.message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Hide form IMMEDIATELY and mark as submitted
        setShowSchedulingForm(false);
        setSchedulingFormSubmitted(true);

        // Clear form data
        setSchedulingFormData({
          meetingType: '15min',
          selectedDate: '',
          selectedTimeSlot: '',
          timezone: 'America/New_York'
        });
        setAvailableSlots([]);
        setSelectedDate('');

        // Show typing animation and success messages
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(`Excellent! Your ${meetingType === '15min' ? '15-minute call' : '30-minute project discussion'} with Amogh has been scheduled successfully for ${selectedDateStr} at ${selectedTime}.`);

          // Add a follow-up message with calendar link
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              const calendarMessage = data.eventLink
                ? `🎉 Meeting scheduled successfully!\n\n📅 **Add to your calendar:**\n${data.eventLink}\n\n✅ Amogh will reach out with video call details\n✅ You'll receive email reminders\n✅ All meeting details are saved\n\nThank you for your interest in connecting!`
                : "Amogh will receive the meeting details and will reach out to you with any additional information or Google Meet link if needed. Thank you for your interest in connecting!";

              addBotMessage(calendarMessage);

              // Show final quick questions
              setTimeout(() => {
                setQuickQuestionType('post-contact');
                setShowQuickQuestions(true);
                // Focus input after scheduling form flow
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 500);
            }, 1200);
          }, 800);
        }, 1000 + Math.random() * 800);
      } else {
        setIsTyping(false);
        setShowSchedulingForm(false); // Hide form on error too
        addBotMessage(`Sorry, there was an issue scheduling your meeting: ${data.error || 'Unknown error'}. Please try again or contact Amogh directly.`);
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Sorry, there was an issue scheduling your meeting. Please try again or contact Amogh directly at amoghr@gwu.edu");
      }, 800);
    }
  };

  const handleContactSubmit = async () => {
    try {
      setIsTyping(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        // Hide form and mark as submitted, but preserve contact data for scheduling
        setShowContactForm(false);
        setContactFormSubmitted(true); // Mark as submitted
        // Note: NOT clearing contactFormData so it's available for scheduling

        // Small delay to let form disappear, then show typing
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addBotMessage("Perfect! Your message has been sent to Amogh successfully. He'll review it and get back to you soon!");

            // Add a follow-up message - different based on whether user requested scheduling
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);

                if (directSchedulingRequest) {
                  // User originally asked to schedule - proceed directly to scheduling
                  addBotMessage("Now let's schedule your meeting with Amogh. Please select your preferred date and time below.");

                  setTimeout(() => {
                    setShowSchedulingForm(true);
                    setIsExpanded(true);
                    setDirectSchedulingRequest(false); // Reset flag
                  }, 300);
                } else {
                  // Regular contact form - offer scheduling option
                  addBotMessage("Perfect! Your message has been sent successfully. Would you also like to schedule a meeting with Amogh to discuss your project in more detail?");

                  // Show scheduling option after contact form submission
                  setTimeout(() => {
                    setQuickQuestionType('post-contact');
                    setShowQuickQuestions(true);
                    // Focus input after contact form flow
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 500);
                }
              }, 1200);
            }, 800);
          }, 1000 + Math.random() * 800);
        }, 200);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("Sorry, there was an issue sending your message. Please try again or contact Amogh directly at amoghr@gwu.edu");
        }, 800);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Sorry, there was an issue sending your message. Please try again or contact Amogh directly at amoghr@gwu.edu");
      }, 800);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <Box
          onClick={handleClose}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)',
            zIndex: 1200,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: { xs: 'block', sm: 'none' } // Only show on mobile
          }}
        />
      )}

      {/* Chat Panel */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: {
            xs: 'calc(100vw - 48px)',
            sm: isExpanded ? 600 : 400
          },
          maxWidth: isExpanded ? 600 : 400,
          height: {
            xs: 'calc(100vh - 100px)',
            sm: isExpanded ? 700 : 500
          },
          maxHeight: isExpanded ? 700 : 500,
          zIndex: 1300,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.95)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transformOrigin: 'bottom right'
        }}
      >
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isDarkMode
            ? '0 24px 48px rgba(0, 0, 0, 0.4)'
            : '0 24px 48px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            minHeight: 72
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 36,
                height: 36
              }}
            >
              <BotIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Amogh&apos;s Assistant
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: chatbotStatus?.status === 'online'
                    ? '#4caf50'
                    : chatbotStatus?.status === 'offline'
                      ? '#f44336'
                      : '#ff9800',
                  fontWeight: 500
                }}
              >
                {chatbotStatus?.status === 'online'
                  ? 'Online'
                  : chatbotStatus?.status === 'offline'
                    ? 'Offline'
                    : 'Checking...'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={toggleExpanded}
              size="small"
              title={isExpanded ? 'Collapse' : 'Expand'}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              {isExpanded ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
            </IconButton>

            <Button
              size="small"
              onClick={resetChat}
              variant="text"
              sx={{
                minWidth: 'auto',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              New Chat
            </Button>

            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                mb: 1
              }}
            >
              <Box
                sx={{
                  maxWidth: message.isBot ? (isExpanded ? '95%' : '90%') : '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.isBot ? 'flex-start' : 'flex-end'
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: message.isBot
                      ? alpha(theme.palette.background.default, 0.8)
                      : theme.palette.primary.main,
                    color: message.isBot
                      ? theme.palette.text.primary
                      : theme.palette.primary.contrastText,
                    borderRadius: 2,
                    border: message.isBot
                      ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      : 'none',
                    maxWidth: '100%',
                    wordBreak: 'break-word'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    {formatMessage(message.text)}
                  </Box>
                </Paper>
              </Box>
            </Box>
          ))}

          {isTyping && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.text.secondary,
                      animation: 'typing 1.4s infinite ease-in-out'
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.text.secondary,
                      animation: 'typing 1.4s infinite ease-in-out 0.2s'
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.text.secondary,
                      animation: 'typing 1.4s infinite ease-in-out 0.4s'
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}


          {/* Scheduling Form */}
          {showSchedulingForm && !schedulingFormSubmitted && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                border: `2px solid ${theme.palette.secondary.main}`,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarIcon sx={{ color: theme.palette.secondary.main, fontSize: '1rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                  Schedule Meeting
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  size="small"
                  label="Meeting Type *"
                  value={schedulingFormData.meetingType}
                  onChange={(e) => setSchedulingFormData(prev => ({ ...prev, meetingType: e.target.value as '15min' | '30min' }))}
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& select': {
                        fontSize: { xs: '16px', sm: '14px' }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', sm: '14px' }
                    }
                  }}
                >
                  <option value="15min">15-minute call</option>
                  <option value="30min">30-minute project discussion</option>
                </TextField>

                {/* Date Selection */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: theme.palette.secondary.main }}>
                    Select a Date *
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: 1,
                      mb: 2
                    }}
                  >
                    {getAvailableDates().map((date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = date.getDate();
                      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

                      return (
                        <Paper
                          key={dateStr}
                          onClick={() => handleDateSelect(dateStr)}
                          sx={{
                            p: 1.5,
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: isSelected
                              ? `2px solid ${theme.palette.secondary.main}`
                              : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            backgroundColor: isSelected
                              ? alpha(theme.palette.secondary.main, 0.1)
                              : alpha(theme.palette.background.paper, 0.8),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: theme.palette.secondary.main,
                              backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: isSelected ? theme.palette.secondary.main : theme.palette.text.secondary,
                              fontWeight: 500,
                              fontSize: '0.7rem'
                            }}
                          >
                            {dayName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: isSelected ? theme.palette.secondary.main : theme.palette.text.primary,
                              fontSize: '1.1rem',
                              lineHeight: 1
                            }}
                          >
                            {dayNum}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: isSelected ? theme.palette.secondary.main : theme.palette.text.secondary,
                              fontSize: '0.7rem'
                            }}
                          >
                            {monthName}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                </Box>

                {/* Time Slot Selection */}
                {selectedDate && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: theme.palette.secondary.main }}>
                      Select a Time *
                    </Typography>
                    {loadingSlots ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Loading available times...
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                          gap: 1,
                          mb: 2
                        }}
                      >
                        {availableSlots.map((timeSlot) => {
                          const isSelected = schedulingFormData.selectedTimeSlot === timeSlot;
                          const formattedTime = formatTimeSlot(timeSlot);

                          return (
                            <Paper
                              key={timeSlot}
                              onClick={() => handleTimeSlotSelect(timeSlot)}
                              sx={{
                                p: 1,
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: isSelected
                                  ? `2px solid ${theme.palette.secondary.main}`
                                  : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                backgroundColor: isSelected
                                  ? alpha(theme.palette.secondary.main, 0.1)
                                  : alpha(theme.palette.background.paper, 0.8),
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: theme.palette.secondary.main,
                                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                                  transform: 'translateY(-1px)'
                                }
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: isSelected ? theme.palette.secondary.main : theme.palette.text.primary,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {formattedTime}
                              </Typography>
                            </Paper>
                          );
                        })}
                      </Box>
                    )}
                    {availableSlots.length === 0 && !loadingSlots && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          No available time slots for this date. Please select another date.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}


                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleSchedulingSubmit}
                    disabled={!schedulingFormData.selectedDate || !schedulingFormData.selectedTimeSlot || isTyping}
                    sx={{
                      flex: 1,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      backgroundColor: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.dark
                      }
                    }}
                  >
                    {isTyping ? 'Scheduling...' : 'Schedule Meeting'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowSchedulingForm(false);

                      // Add typing animation for cancel response
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addBotMessage("No problem! Feel free to schedule a meeting anytime. What else would you like to know about Amogh's work?");

                        // Show quick questions after a brief delay
                        setTimeout(() => {
                          setShowQuickQuestions(true);
                          setQuickQuestionType('post-contact');
                          // Focus input after cancellation
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 600);
                      }, 800 + Math.random() * 600);
                    }}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        borderColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary.dark
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Contact Form */}
          {showContactForm && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmailIcon sx={{ color: theme.palette.primary.main, fontSize: '1rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Contact Form
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  size="small"
                  label="Full Name *"
                  value={contactFormData.fullName}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& input': {
                        fontSize: { xs: '16px', sm: '14px' }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', sm: '14px' }
                    }
                  }}
                />

                <TextField
                  size="small"
                  label="Email *"
                  type="email"
                  value={contactFormData.email}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& input': {
                        fontSize: { xs: '16px', sm: '14px' }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', sm: '14px' }
                    }
                  }}
                />

                <TextField
                  size="small"
                  label="Phone Number (Optional)"
                  value={contactFormData.phoneNumber}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& input': {
                        fontSize: { xs: '16px', sm: '14px' }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', sm: '14px' }
                    }
                  }}
                />

                <TextField
                  label="Message *"
                  multiline
                  rows={3}
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  placeholder="Tell Amogh about your project, collaboration opportunity, or hiring needs..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& textarea': {
                        fontSize: { xs: '16px', sm: '14px' }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '16px', sm: '14px' }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: { xs: '16px', sm: '14px' }
                    }
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleContactSubmit}
                    disabled={!contactFormData.fullName || !contactFormData.email || !contactFormData.message || isTyping}
                    sx={{
                      flex: 1,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {isTyping ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowContactForm(false);

                      // Add typing animation for cancel response
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addBotMessage("No worries! What else would you like to know about Amogh's profile? I can tell you about his experience, projects, education, or anything else you're curious about.");

                        // Show quick questions after a brief delay
                        setTimeout(() => {
                          setShowQuickQuestions(true);
                          setQuickQuestionType('initial');
                          setIsExpanded(true);
                          // Focus input after cancellation
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 600);
                      }, 800 + Math.random() * 600);
                    }}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Quick Action Buttons - Compact bubbles */}
          {showQuickQuestions && (
            <Box
              sx={{
                mt: 1.5,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                mb: 1
              }}
            >
              {quickQuestionType === 'initial' ? (
                <>
                  {/* Initial Questions */}
                  <Paper
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: { xs: 'none', sm: 1 },
                      maxWidth: { xs: '90%', sm: 'none' },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`
                      }
                    }}
                    onClick={() => handleQuickQuestion("How can I contact Amogh?")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                      <ContactIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.primary.main }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Contact Amogh
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: { xs: 'none', sm: 1 },
                      maxWidth: { xs: '90%', sm: 'none' },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`
                      }
                    }}
                    onClick={() => handleQuickQuestion("Tell me about Amogh's recent projects")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                      <ProjectIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.primary.main }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Recent Projects
                      </Typography>
                    </Box>
                  </Paper>
                </>
              ) : (
                <>
                  {/* Post-Contact Questions */}
                  {schedulingFormSubmitted ? (
                    <Paper
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        backgroundColor: alpha(theme.palette.success.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        borderRadius: 2,
                        flex: { xs: 'none', sm: 1 },
                        maxWidth: { xs: '90%', sm: 'none' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <ScheduleIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.success.main }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.success.main,
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Meeting Scheduled ✓
                        </Typography>
                      </Box>
                    </Paper>
                  ) : (
                    <Paper
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: { xs: 'none', sm: 1 },
                        maxWidth: { xs: '90%', sm: 'none' },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`
                        }
                      }}
                      onClick={() => handleQuickQuestion("I'd like to schedule a meeting with Amogh")}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <ScheduleIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.primary.main }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Schedule Meeting
                        </Typography>
                      </Box>
                    </Paper>
                  )}

                  <Paper
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: { xs: 'none', sm: 1 },
                      maxWidth: { xs: '90%', sm: 'none' },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`
                      }
                    }}
                    onClick={() => handleQuickQuestion("Tell me about Amogh's work experience")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                      <ExperienceIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.primary.main }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Work Experience
                      </Typography>
                    </Box>
                  </Paper>
                </>
              )}
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.default, 0.5)
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={
                chatbotStatus?.status === 'offline'
                  ? 'Chatbot is currently offline...'
                  : showSchedulingForm && !schedulingFormSubmitted
                    ? 'Please fill out the scheduling form above...'
                    : showContactForm && !contactFormSubmitted
                      ? 'Please fill out the contact form above...'
                      : "Ask about Amogh's experience, projects, or skills..."
              }
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping || chatbotStatus?.status === 'offline' || (showContactForm && !contactFormSubmitted) || (showSchedulingForm && !schedulingFormSubmitted)}
              size="small"
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& input': {
                    fontSize: { xs: '16px', sm: '14px' }, // 16px+ on mobile prevents zoom
                    '@media (max-width: 600px)': {
                      fontSize: '16px'
                    }
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  fontSize: { xs: '16px', sm: '14px' },
                  '@media (max-width: 600px)': {
                    fontSize: '16px'
                  }
                }
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!currentInput.trim() || isTyping || chatbotStatus?.status === 'offline' || (showContactForm && !contactFormSubmitted) || (showSchedulingForm && !schedulingFormSubmitted)}
              color="primary"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      </Box>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ChatModal;