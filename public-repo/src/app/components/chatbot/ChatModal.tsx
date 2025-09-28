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
  School as EducationIcon
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
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, onNewMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [quickQuestionType, setQuickQuestionType] = useState<'initial' | 'post-contact'>('initial');
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
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
      if (inputRef.current && !showContactForm) {
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
      addBotMessage('Sorry, I\'m having trouble connecting right now. Please try asking your question again, or feel free to contact Amogh directly through the contact form on his portfolio.');
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isTyping) return;

    const input = currentInput.trim();
    setShowQuickQuestions(false); // Hide quick questions when user types

    // Check if the message is about contacting Amogh (comprehensive detection)
    const contactKeywords = ['contact', 'reach', 'get in touch', 'hire', 'collaborate', 'email', 'phone', 'message', 'write to'];
    const contactPronouns = ['amogh', 'you', 'him', 'his', 'he', 'author', 'owner'];

    const hasContactKeyword = contactKeywords.some(keyword => input.toLowerCase().includes(keyword));
    const hasContactContext = contactPronouns.some(pronoun => input.toLowerCase().includes(pronoun));

    // Trigger contact form if: has contact keyword AND (has context OR is just asking about "contact")
    const isContactQuery = hasContactKeyword && (hasContactContext || input.toLowerCase().includes('contact'));

    if (isContactQuery) {
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
    setShowQuickQuestions(false);
    setQuickQuestionType('initial');
    setContactFormSubmitted(false);
    setContactFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      message: ''
    });
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

    if (question.toLowerCase().includes('contact')) {
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
        // Hide form first, then show typing animation
        setContactFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });
        setShowContactForm(false);
        setContactFormSubmitted(true); // Mark as submitted

        // Small delay to let form disappear, then show typing
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addBotMessage("Perfect! Your message has been sent to Amogh successfully. He'll review it and get back to you soon!");

            // Add a follow-up message with typing animation
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addBotMessage("While you wait for his response, feel free to explore more about his work and experience! What else would you like to know?");

                // Show post-contact quick questions after the follow-up message
                setTimeout(() => {
                  setQuickQuestionType('post-contact');
                  setShowQuickQuestions(true);
                  // Focus input after contact form flow
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }, 500);
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
              <Typography variant="caption" color="text.secondary">
                Online
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
                    onClick={() => handleQuickQuestion("What are Amogh's technical skills?")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                      <EducationIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.primary.main }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Technical Skills
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
              placeholder="Ask about Amogh's experience, projects, or skills..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
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
              disabled={!currentInput.trim() || isTyping}
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