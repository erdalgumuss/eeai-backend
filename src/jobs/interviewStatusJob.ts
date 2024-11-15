import cron from 'node-cron';
import Interview from '../models/interview/Interview';

// Mülakat durumlarını güncelleyen cron job
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    // Tarihi geçmiş olan ve hala "active" durumda olan mülakatları pasif yap
    const updatedInactiveInterviews = await Interview.updateMany(
      { expirationDate: { $lte: now }, status: 'active' },
      { status: 'inactive' }
    );

    console.log(`Pasif duruma alınan mülakat sayısı: ${updatedInactiveInterviews.modifiedCount}`);

    // Maksimum katılımcıya ulaşmış mülakatları tamamla
    const interviewsToComplete = await Interview.find({
      status: 'active',
      maxParticipants: { $ne: null },
      $expr: { $gte: ['$currentParticipants', '$maxParticipants'] },
    });

    for (const interview of interviewsToComplete) {
      interview.status = 'completed';
      await interview.save();
    }

    console.log(`Tamamlanan mülakat sayısı: ${interviewsToComplete.length}`);
  } catch (error) {
    console.error('Mülakat durumu güncelleme sırasında hata:', error);
  }
});
