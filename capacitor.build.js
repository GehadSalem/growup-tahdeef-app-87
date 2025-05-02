
// بسيط لمساعدة المستخدمين في بناء ومزامنة التطبيق مع Capacitor
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔨 بناء تطبيق الويب...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ تم بناء تطبيق الويب بنجاح!');
} catch (error) {
  console.error('❌ فشل في بناء تطبيق الويب:', error);
  process.exit(1);
}

console.log('📱 مزامنة مع Capacitor...');
try {
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ تمت المزامنة بنجاح!');
} catch (error) {
  console.error('❌ فشل في المزامنة مع Capacitor:', error);
  process.exit(1);
}

console.log('\n🎉 تم الانتهاء! يمكنك الآن تشغيل التطبيق على الأجهزة المحمولة باستخدام:');
console.log('   - لأجهزة Android: npx cap open android');
console.log('   - لأجهزة iOS: npx cap open ios');
console.log('\nملاحظة: لتشغيل التطبيق على أجهزة iOS، تحتاج إلى جهاز Mac مع Xcode مثبت.');
