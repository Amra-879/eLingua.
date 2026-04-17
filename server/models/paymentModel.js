const db = require("../database/database");

const createPayment = (student_id, amount, paypal_order_id) => {
  return db.prepare(`
    INSERT INTO payments (student_id, amount, paypal_order_id, status)
    VALUES (?, ?, ?, 'pending')
  `).run(student_id, amount, paypal_order_id);
};

const getPaymentByOrderId = (paypal_order_id) => {
  return db.prepare(`
    SELECT * FROM payments WHERE paypal_order_id = ?
  `).get(paypal_order_id);
};

const getPaymentById = (id) => {
  return db.prepare(`
    SELECT * FROM payments WHERE id = ?
  `).get(id);
};

const updatePaymentStatus = (paypal_order_id, status, paypal_capture_id = null) => {
  return db.prepare(`
    UPDATE payments
    SET status = ?, paypal_capture_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE paypal_order_id = ?
  `).run(status, paypal_capture_id, paypal_order_id);
};

const linkPaymentToSubmission = (paypal_order_id, submission_id) => {
  return db.prepare(`
    UPDATE payments
    SET submission_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE paypal_order_id = ?
  `).run(submission_id, paypal_order_id);
};

const getPaymentsByStudent = (student_id) => {
  return db.prepare(`
    SELECT p.*, s.id as submission_id
    FROM payments p
    LEFT JOIN submissions s ON p.submission_id = s.id
    WHERE p.student_id = ?
    ORDER BY p.created_at DESC
  `).all(student_id);
};

const getRevenueByLanguage = () => {
  return db.prepare(`
    SELECT l.name as language_name,
           COUNT(pay.id) as count,
           ROUND(SUM(pay.amount), 2) as total
    FROM payments pay
    JOIN submissions s ON pay.submission_id = s.id
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    WHERE pay.status = 'completed'
    GROUP BY l.id
    ORDER BY total DESC
  `).all();
};


/**
 * Dohvata prihod po profesorima za tekući mjesec
 * Platforma zadržava 0.5 USD po eseju
 */

const getRevenueByProfessor = () => {
  return db.prepare(`
    SELECT 
      u.id as professor_id,
      u.name as professor_name,
      u.last_name as professor_last_name,
      COUNT(f.id) as reviewed_essays,
      ROUND(SUM(pay.amount - 0.5), 2) as total_revenue
    FROM feedback f
    JOIN submissions s ON f.submission_id = s.id
    JOIN payments pay ON pay.submission_id = s.id
    JOIN users u ON f.professor_id = u.id
    WHERE pay.status = 'completed'
      AND f.professor_id IS NOT NULL
    GROUP BY u.id, u.name, u.last_name
    ORDER BY total_revenue DESC
  `).all();
};

/**
 * Dohvata prihod po profesorima za tekući mjesec
 * Platforma zadržava 0.5 USD po eseju
 */
  const getCurrentMonthRevenueByProfessor = () => {
    return db.prepare(`
      SELECT 
        u.id as professor_id,
        u.name as professor_name,
        u.last_name as professor_last_name,
        COUNT(f.id) as reviewed_essays_this_month,
        ROUND(SUM(pay.amount - 0.5), 2) as revenue_this_month
      FROM feedback f
      JOIN submissions s ON f.submission_id = s.id
      JOIN payments pay ON pay.submission_id = s.id
      JOIN users u ON f.professor_id = u.id
      WHERE pay.status = 'completed'
        AND f.professor_id IS NOT NULL
        AND strftime('%Y-%m', feedback.created_at) = strftime('%Y-%m', 'now')
      GROUP BY u.id, u.name, u.last_name
      ORDER BY revenue_this_month DESC
    `).all();
};

const getTotalRevenue = () => {
  return db.prepare(`
    SELECT ROUND(SUM(amount), 2) as total
    FROM payments WHERE status = 'completed'
  `).get();
};


module.exports = {
  createPayment,
  getPaymentByOrderId,
  getPaymentById,
  updatePaymentStatus,
  linkPaymentToSubmission,
  getPaymentsByStudent,
  getRevenueByLanguage,
  getRevenueByProfessor,
  getCurrentMonthRevenueByProfessor,
  getTotalRevenue,
};