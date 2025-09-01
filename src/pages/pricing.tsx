import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { 
  CheckCircle, 
  Star, 
  Clock, 
  Users, 
  Settings, 
  MessageSquare, 
  Shield, 
  Zap,
  Crown,
  Gift
} from 'lucide-react';

const PricingPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [dynamicPricing, setDynamicPricing] = useState<any>(null);

  const scrollToContact = () => {
    // Navigate to home page contact section
    window.location.href = '/#contact-section';
  };

  // Load dynamic pricing data
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const response = await fetch('/api/pricing');
        if (response.ok) {
          const pricingData = await response.json();
          setDynamicPricing(pricingData);
        }
      } catch (error) {
        console.error('Error loading pricing data:', error);
      }
    };

    loadPricing();
  }, []);

  // Helper function to get dynamic price
  const getDynamicPrice = (planId: string, field: string) => {
    if (!dynamicPricing?.plans) return null;
    const plan = dynamicPricing.plans.find((p: any) => p.id === planId);
    return plan?.[field] || null;
  };

  const plans = [
    {
      id: 'free-trial',
      name: 'تجربة مجانية',
      nameEn: 'Free Trial',
      nameFr: 'Essai gratuit',
      price: '0',
      period: 'لمدة أسبوع',
      periodEn: 'for 1 week',
      periodFr: 'pour 1 semaine',
      setup: null,
      popular: false,
      icon: Gift,
      color: 'green',
      features: [
        'تجربة مجانية للمدرسة كاملة',
        'عدد محدود من الطلاب',
        'دعم أساسي أثناء التجربة'
      ],
      featuresEn: [
        'Full school trial experience',
        'Limited number of students',
        'Basic support during trial'
      ],
      featuresFr: [
        'Expérience d\'essai complète de l\'école',
        'Nombre limité d\'étudiants',
        'Support de base pendant l\'essai'
      ]
    },
    {
      id: 'basic',
      name: 'الخطة الأساسية',
      nameEn: 'Basic Plan',
      nameFr: 'Plan de base',
      price: '1,500',
      period: 'شهر',
      periodEn: 'month',
      periodFr: 'mois',
      setup: '29,000',
      popular: true,
      icon: Users,
      color: 'blue',
      yearlyPrice: '10,000',
      features: [
        'تخصيص كامل (شعار المدرسة – الألوان – الواجهة)',
        'إدارة الطلاب والمعلمين',
        'تسجيل الحضور والغياب',
        'إرسال رسائل وتنبيهات لأولياء الأمور',
        'تحديثات وتحسينات مستمرة'
      ],
      featuresEn: [
        'Full customization (school logo - colors - interface)',
        'Student and teacher management',
        'Attendance tracking',
        'Send messages and notifications to parents',
        'Continuous updates and improvements'
      ],
      featuresFr: [
        'Personnalisation complète (logo école - couleurs - interface)',
        'Gestion des étudiants et enseignants',
        'Suivi des présences',
        'Envoi de messages et notifications aux parents',
        'Mises à jour et améliorations continues'
      ]
    },
    {
      id: 'standard',
      name: 'الخطة القياسية',
      nameEn: 'Standard Plan',
      nameFr: 'Plan standard',
      price: '3,000',
      period: 'شهر',
      periodEn: 'month',
      periodFr: 'mois',
      setup: '29,000',
      popular: false,
      icon: Settings,
      color: 'purple',
      yearlyPrice: '20,000',
      features: [
        'كل مزايا الخطة الأساسية',
        'إصلاح أخطاء مجاني وسريع',
        'إمكانية تعديل النظام حسب احتياجاتكم'
      ],
      featuresEn: [
        'All Basic Plan features',
        'Free and fast bug fixes',
        'System customization according to your needs'
      ],
      featuresFr: [
        'Toutes les fonctionnalités du plan de base',
        'Corrections de bugs gratuites et rapides',
        'Personnalisation du système selon vos besoins'
      ]
    },
    {
      id: 'lifetime',
      name: 'خطة مدى الحياة',
      nameEn: 'Lifetime Plan',
      nameFr: 'Plan à vie',
      price: '90,000',
      period: 'دفعة واحدة',
      periodEn: 'one-time payment',
      periodFr: 'paiement unique',
      setup: null,
      popular: false,
      icon: Crown,
      color: 'gold',
      features: [
        'تسطيب كامل بدون اشتراكات',
        'كل مزايا الخطة القياسية',
        'دعم فني أولوية 24/7',
        'إصلاح أخطاء مجاني وسريع',
        'إمكانية تعديل النظام حسب احتياجاتكم'
      ],
      featuresEn: [
        'Complete setup without subscriptions',
        'All Standard Plan features',
        'Priority 24/7 technical support',
        'Free and fast bug fixes',
        'System customization according to your needs'
      ],
      featuresFr: [
        'Installation complète sans abonnements',
        'Toutes les fonctionnalités du plan standard',
        'Support technique prioritaire 24/7',
        'Corrections de bugs gratuites et rapides',
        'Personnalisation du système selon vos besoins'
      ]
    }
  ];

  const getColorClasses = (color: string, popular: boolean) => {
    const baseClasses = {
      green: {
        border: 'border-green-200 dark:border-green-800',
        bg: 'bg-green-50 dark:bg-green-950',
        icon: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
        button: 'bg-green-600 hover:bg-green-700'
      },
      blue: {
        border: 'border-blue-200 dark:border-blue-800',
        bg: 'bg-blue-50 dark:bg-blue-950',
        icon: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        border: 'border-purple-200 dark:border-purple-800',
        bg: 'bg-purple-50 dark:bg-purple-950',
        icon: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      gold: {
        border: 'border-yellow-200 dark:border-yellow-800',
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        icon: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      }
    };

    return popular 
      ? {
          border: 'border-2 border-blue-500 dark:border-blue-400',
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
          icon: baseClasses[color].icon,
          button: baseClasses[color].button
        }
      : baseClasses[color];
  };

  const getCurrentFeatures = (plan: any) => {
    switch (i18n.language) {
      case 'ar':
        return plan.features;
      case 'fr':
        return plan.featuresFr;
      case 'en':
        return plan.featuresEn;
      default:
        return plan.features;
    }
  };

  const getCurrentPlanName = (plan: any) => {
    switch (i18n.language) {
      case 'ar':
        return plan.name;
      case 'fr':
        return plan.nameFr;
      case 'en':
        return plan.nameEn;
      default:
        return plan.name;
    }
  };

  const getCurrentPeriod = (plan: any) => {
    switch (i18n.language) {
      case 'ar':
        return plan.period;
      case 'fr':
        return plan.periodFr;
      case 'en':
        return plan.periodEn;
      default:
        return plan.period;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('pricing.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('pricing.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {plans.map((plan) => {
              const colorClasses = getColorClasses(plan.color, plan.popular);
              const IconComponent = plan.icon;

              return (
                <Card 
                  key={plan.id} 
                  className={`relative hover:shadow-xl transition-all duration-300 ${colorClasses.border} ${colorClasses.bg}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1" />
                        {t('pricing.popular')}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 ${colorClasses.icon} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {getCurrentPlanName(plan)}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {getDynamicPrice(plan.id, 'price') || plan.price}
                        </span>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          {t('pricing.currency')}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {getCurrentPeriod(plan)}
                      </p>
                      {(getDynamicPrice(plan.id, 'setup') || plan.setup) && (
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 p-6 rounded-xl border-3 border-orange-400 dark:border-orange-500 shadow-xl">
                          <p className="text-3xl font-black text-orange-800 dark:text-orange-200 text-center leading-tight">
                            💰 {t('pricing.setup')}: {getDynamicPrice(plan.id, 'setup') || plan.setup} {t('pricing.currency')}
                          </p>
                        </div>
                      )}
                      {(getDynamicPrice(plan.id, 'yearlyPrice') || plan.yearlyPrice) && (
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border-3 border-green-400 dark:border-green-500 shadow-xl">
                          <p className="text-3xl font-black text-green-800 dark:text-green-200 text-center leading-tight">
                            🎯 {t('pricing.yearly')}: {getDynamicPrice(plan.id, 'yearlyPrice') || plan.yearlyPrice} {t('pricing.currency')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {getCurrentFeatures(plan).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${colorClasses.button} text-white py-3 text-lg font-semibold`}
                      onClick={scrollToContact}
                    >
                      {t('pricing.startNow')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing.faq.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('pricing.faq.description')}
            </p>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.faq.q1')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t('pricing.faq.a1')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.faq.q2')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t('pricing.faq.a2')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.faq.q3')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t('pricing.faq.a3')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('pricing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('pricing.cta.description')}
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            onClick={scrollToContact}
          >
            {t('pricing.cta.button')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('footer.title')}</h3>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.features.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.features.studentManagement')}</li>
                <li>{t('footer.features.attendanceTracking')}</li>
                <li>{t('footer.features.paymentSystem')}</li>
                <li>{t('footer.features.communication')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.about.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.about.aboutUs')}</li>
                <li>{t('footer.about.faq')}</li>
                <li>{t('footer.about.support')}</li>
                <li>{t('footer.about.privacy')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.technical.title')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>{t('footer.technical.worksOnAnyDevice')}</li>
                <li>{t('footer.technical.compatibleWithAllBrowsers')}</li>
                <li>{t('footer.technical.noInstallationRequired')}</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Taalim Flow. {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;